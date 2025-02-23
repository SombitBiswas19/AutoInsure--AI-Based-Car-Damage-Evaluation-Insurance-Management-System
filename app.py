from flask import Flask, request, jsonify, render_template,json
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier

# Initialize Flask app
app = Flask(__name__)

# Load the trained model and necessary encoders and scalers
model = joblib.load("random_forest_model.pkl")
label_encoders = joblib.load("label_encoders.pkl")
scaler = joblib.load("scaler.pkl")
policy_encoder = joblib.load("policy_encoder.pkl")


@app.route('/process-data', methods=['POST'])
def process_data():
    user_input = request.json  
    user_data = pd.DataFrame([user_input])

    # Preprocess user data based on model's requirements
    for column, le in label_encoders.items():
        if column in user_data:
            try:
                # Attempt to transform using the existing label encoder
                user_data[column] = le.transform([user_data[column]])[0]
            except ValueError:
                # Handle unseen label by setting it to a default or placeholder value
                user_data[column] = -1  # Use -1 or any placeholder your model can handle

    # Scale numerical features
    user_data[['Age', 'Annual_Income']] = scaler.transform(user_data[['Age', 'Annual_Income']])

    # Predict probabilities for each policy
    probs = model.predict_proba(user_data)[0]
    top_n_indices = np.argsort(probs)[-7:][::-1]  # Get indices of top 7 probabilities
    recommended_policies = policy_encoder.inverse_transform(top_n_indices)
#     data = {
#     "one": recommended_policies[0],
#     "two": recommended_policies[1],
#     "three": recommended_policies[2],
#     "four": recommended_policies[3],
#     "five": recommended_policies[4],
#     "six": recommended_policies[5],
#     "seven": recommended_policies[6]
# }
    
    data={
        "order":recommended_policies.tolist()
    }
    print(type(recommended_policies.tolist()))

    result = {"message":"result sent","data":data}
    return json.dumps(result)

# Route for making recommendations
@app.route('/recommend', methods=['GET'])
def index():
    # Collect user input from form
    user_input = {
        'Gender': 'Male',
        'Age': 30,
        'Region_Code': 'N',
        'Location_Type': 'Urban',
        'Education': 'Bachelors',
        'Annual_Income': 1000000,
        'Vehicle_Type': 'SUV',
        'Previously_Insured': 0,
        'Vehicle_Age': '< 10 Years',
        'Vehicle_Damage': 0
    }
    
    # Convert form data into DataFrame
    user_data = pd.DataFrame([user_input])

    # Preprocess user data based on model's requirements
    for column, le in label_encoders.items():
        if column in user_data:
            try:
                # Attempt to transform using the existing label encoder
                user_data[column] = le.transform([user_data[column]])[0]
            except ValueError:
                # Handle unseen label by setting it to a default or placeholder value
                user_data[column] = -1  # Use -1 or any placeholder your model can handle

    # Scale numerical features
    user_data[['Age', 'Annual_Income']] = scaler.transform(user_data[['Age', 'Annual_Income']])

    # Predict probabilities for each policy
    probs = model.predict_proba(user_data)[0]
    top_n_indices = np.argsort(probs)[-7:][::-1]  # Get indices of top 7 probabilities
    recommended_policies = policy_encoder.inverse_transform(top_n_indices)
#     data = {
#     "one": recommended_policies[0],
#     "two": recommended_policies[1],
#     "three": recommended_policies[2],
#     "four": recommended_policies[3],
#     "five": recommended_policies[4],
#     "six": recommended_policies[5],
#     "seven": recommended_policies[6]
# }
    
    data={
        "order":recommended_policies.tolist()
    }
    print(type(recommended_policies.tolist()))
    # Return recommendations to the webpage
    return json.dumps(data)

if __name__ == '__main__':
    app.run(port=3000,debug=True)
