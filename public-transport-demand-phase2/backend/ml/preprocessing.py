import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder,StandardScaler
NUM=['hour','temperature','humidity','holiday','weekend','previous_demand','day_of_week','month','day']; CAT=['route','weather']
def load_and_clean(path='dataset/transport_demand.csv'):
 df=pd.read_csv(path);df['date']=pd.to_datetime(df['date'],errors='coerce');df=df.dropna(subset=['date','passenger_demand']).drop_duplicates();df['day_of_week']=df.date.dt.dayofweek;df['month']=df.date.dt.month;df['day']=df.date.dt.day;return df
def build_preprocessor():return ColumnTransformer([('num',StandardScaler(),NUM),('cat',OneHotEncoder(handle_unknown='ignore'),CAT)])
