from flask import Flask, request, jsonify
import os
import pandas as pd
from prophet import Prophet
from sqlalchemy import create_engine
import warnings
from flask_cors import CORS

# Ignorar advertencias
warnings.filterwarnings("ignore")

# Configurar la codificación
os.environ["PGCLIENTENCODING"] = "utf-8"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Definir días festivos o eventos especiales que afecten las ventas
holidays = pd.DataFrame({
    'holiday': 'event_name',
    'ds': pd.to_datetime(['2024-12-25', '2025-01-01']),  # Ejemplo de fechas, ajustar según necesidades
    'lower_window': 0,
    'upper_window': 1,
})

# Función de suavizado para reducir la proyección de ventas
def apply_exponential_smoothing(series, alpha=0.5):
    result = [series[0]]
    for n in range(1, len(series)):
        result.append(alpha * series[n] + (1 - alpha) * result[n-1])
    return result

# Endpoint para predicción de ventas (por días de la semana)
@app.route('/api/predict-sales', methods=['GET'])
def predict_sales():
    try:
        print("Obteniendo datos de ventas...")
        sales_data = get_sales_data()
        print("Datos obtenidos:", sales_data.head())

        if sales_data.empty or sales_data[['fecha', 'cantidad']].dropna().shape[0] < 2:
            return jsonify({"error": "Insuficientes datos válidos para la predicción"}), 400

        all_forecasts = []
        grouped_data = sales_data.groupby(['categoria', 'plato'])

        for (categoria, plato), group in grouped_data:
            group = group.dropna(subset=['fecha', 'cantidad'])
            if group.shape[0] < 2:
                print(f"Insuficientes datos para el plato '{plato}' en la categoría '{categoria}'")
                continue

            print(f"Procesando plato '{plato}' en la categoría '{categoria}', número de registros: {group.shape[0]}")
            group['ds'] = pd.to_datetime(group['fecha']).dt.tz_localize(None)  # Eliminar zona horaria
            group['y'] = group['cantidad']

            # Configurar límite superior para el modelo
            group['cap'] = group['y'].max() * 1.2  # 20% más alto que el máximo histórico

            # Crear y entrenar el modelo de Prophet con parámetros ajustados
            model = Prophet(
                holidays=holidays,
                changepoint_prior_scale=0.05,  # Aún menos sensible a cambios de tendencia
                seasonality_prior_scale=2,     # Aún menos flexible en estacionalidad
                growth='logistic'              # Limitar el crecimiento usando logística
            )
            model.add_seasonality(name='weekly', period=7, fourier_order=2)  # Estacionalidad semanal más suavizada
            model.fit(group)

            # Predecir los próximos 7 días
            future = model.make_future_dataframe(periods=7, freq='D')
            future['cap'] = group['cap'].iloc[0]
            forecast = model.predict(future)

            # Aplicar suavizado exponencial para reducir proyecciones infladas
            forecast['yhat'] = apply_exponential_smoothing(forecast['yhat'].tolist(), alpha=0.3)
            forecast['yhat_lower'] = apply_exponential_smoothing(forecast['yhat_lower'].tolist(), alpha=0.3)
            forecast['yhat_upper'] = apply_exponential_smoothing(forecast['yhat_upper'].tolist(), alpha=0.3)

            # Procesar las predicciones
            forecast = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
            forecast['categoria'] = categoria
            forecast['plato'] = plato
            forecast['fecha_confirmacion'] = group['ds'].iloc[-1].strftime('%Y-%m-%d %H:%M:%S')
            forecast['yhat'] = forecast['yhat'].apply(lambda x: max(0, round(x)))
            forecast['ds'] = forecast['ds'].dt.strftime('%Y-%m-%d %H:%M:%S')

            all_forecasts.append(forecast)

        if all_forecasts:
            final_forecast = pd.concat(all_forecasts, ignore_index=True)
            final_forecast = final_forecast.groupby(['ds', 'plato', 'categoria', 'fecha_confirmacion']).agg({
                'yhat': 'sum',
                'yhat_lower': 'sum',
                'yhat_upper': 'sum'
            }).reset_index()
            print("DataFrame final agrupado:", final_forecast.head())
        else:
            final_forecast = pd.DataFrame(columns=['ds', 'yhat', 'yhat_lower', 'yhat_upper', 'categoria', 'plato', 'fecha_confirmacion'])

        return jsonify(final_forecast.to_dict(orient="records"))
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

# Endpoint para análisis general de ventas por categoría (sin predicción)
@app.route('/api/sales-summary', methods=['GET'])
def sales_summary():
    try:
        db_uri = "postgresql://postgres:karen@127.0.0.1:5432/AmorMXFinal"
        engine = create_engine(db_uri)
        query = """
        SELECT 
            cp.nombre_categoria AS categoria, 
            pl.nombre AS plato, 
            SUM(ppm.cantidad) AS total_ventas,
            pl.precio,
            SUM(ppm.cantidad * pl.precio) AS total_ingresos
        FROM pedidos_por_mesa ppm
        JOIN pedidos p ON ppm.id_pedido = p.id
        JOIN platos pl ON ppm.id_plato = pl.id
        JOIN categorias_platos cp ON pl.id_categoria = cp.id
        WHERE p.estados_p = false
        GROUP BY cp.nombre_categoria, pl.nombre, pl.precio
        ORDER BY cp.nombre_categoria, pl.nombre;
        """
        sales_data = pd.read_sql(query, engine)
        
        categorias_agrupadas = []
        grouped = sales_data.groupby('categoria')
        for categoria, group in grouped:
            categoria_data = {
                "nombre": categoria,
                "platos": group.to_dict(orient='records')
            }
            categorias_agrupadas.append(categoria_data)

        return jsonify(categorias_agrupadas)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Función para obtener los datos de ventas (compartida por ambos endpoints)
def get_sales_data():
    db_uri = "postgresql://postgres:karen@127.0.0.1:5432/AmorMXFinal"
    engine = create_engine(db_uri)
    query = """
    SELECT 
        ppm.fecha_hora AS fecha, 
        pl.nombre AS plato, 
        ppm.cantidad, 
        cp.nombre_categoria AS categoria,
        pl.precio
    FROM pedidos_por_mesa ppm
    JOIN pedidos p ON ppm.id_pedido = p.id
    JOIN platos pl ON ppm.id_plato = pl.id
    JOIN categorias_platos cp ON pl.id_categoria = cp.id
    WHERE p.estados_p = false;
    """
    sales_data = pd.read_sql(query, engine)
    return sales_data

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3013, debug=True)
