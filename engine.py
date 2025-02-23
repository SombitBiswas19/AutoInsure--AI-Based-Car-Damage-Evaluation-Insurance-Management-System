from IPython.display import display,Image,clear_output
import json
import matplotlib.pyplot as plt
import numpy as np
import pickle
import os
import seaborn as sns
import random
import urllib.request
import h5py

import tensorflow as tf
from tensorflow.keras.utils import get_file
from tensorflow.keras.applications import ResNet50, VGG16, VGG19, InceptionV3
from tensorflow.keras.applications.imagenet_utils import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array, array_to_img, load_img
from tensorflow.keras.models import save_model

first_gate = VGG16(weights='imagenet')

from keras.models import load_model
second_gate = load_model(r'C:\insurance_3\Car_damage_evaluation1\web-app\models\ft_model.keras')
location_model = load_model(r'C:\insurance_3\Car_damage_evaluation1\web-app\models\ft_location_model.keras')
severity_model = load_model(r'C:\insurance_3\Car_damage_evaluation1\web-app\models\ft_severnity_model.keras')

with open('vgg16_cat_list.pk','rb') as f:
    cat_list = pickle.load(f)

print('Cat-list loaded')

# Load ImageNet class index for prediction interpretation
CLASS_INDEX = None
CLASS_INDEX_PATH = 'https://s3.amazonaws.com/deep-learning-models/image-models/imagenet_class_index.json'

def get_predictions(preds, top=5):
    global CLASS_INDEX
    if len(preds.shape) != 2 or preds.shape[1] != 1000:
        raise ValueError('`decode_predictions` expects '
                         'a batch of predictions '
                         '(i.e. a 2D array of shape (samples, 1000)). '
                         'Found array with shape: ' + str(preds.shape))
    if CLASS_INDEX is None:
        fpath = get_file('imagenet_class_index.json',
                         CLASS_INDEX_PATH,
                         cache_subdir='models')
        CLASS_INDEX = json.load(open(fpath))
    results = []
    for pred in preds:
        top_indices = pred.argsort()[-top:][::-1]
        result = [tuple(CLASS_INDEX[str(i)]) + (pred[i],) for i in top_indices]
        result.sort(key=lambda x: x[2], reverse=True)
        results.append(result)
    return results

# Prepare image for VGG16 (224x224)
def prepare_img_244(img_path):
    img = load_img(img_path, target_size=(224, 224))
    x = img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return x

# First gate: Car category validation (based on VGG16)
def car_categories_gate(img244, model):
    print("Validating that this is a picture of your car...")
    out = model.predict(img244)
    top = get_predictions(out, top=5)
    for j in top[0]:
        if j[0:2] in cat_list:
            return True  # "Validation complete - proceed to damage evaluation"
    return False  # "Are you sure this is a picture of your car?"

# Prepare image for damage validation (256x256)
def prepare_img_256(img_path):
    img = load_img(img_path, target_size=(256, 256))
    x = img_to_array(img)
    x = x.reshape((1,) + x.shape)  
    return x

# Second gate: Damage presence validation
def car_damage_gate(img_256, model):
    print("Validating that damage exists...")
    pred = model.predict(img_256)
    if pred[0][0] <= 0.5:
        return True  # "Validation complete - proceed to location and severity determination"
    else:
        return False  # "Are you sure that your car is damaged?"

# Location assessment
def location_assessment(img_256, model):
    print("Determining location of damage...")
    pred = model.predict(img_256)
    pred_label = np.argmax(pred, axis=1)
    d = {0: 'Front', 1: 'Rear', 2: 'Side'}
    
    for key in d.keys():  # Corrected to use d.keys() for iteration
        if pred_label[0] == key:
            print(f"Assessment: {d[key]} damage to vehicle")
    
    print("Location assessment complete.")
    return d.get(pred_label[0], 'Unknown')  # Return location


def severity_assessment(img_256, model):
    print("Determining severity of damage...")
    pred = model.predict(img_256)
    pred_label = np.argmax(pred, axis=1)
    d = {0: 'Minor', 1: 'Moderate', 2: 'Severe'}
    
    for key in d.keys():  # Corrected to use d.keys() for iteration
        if pred_label[0] == key:
            print(f"Assessment: {d[key]} damage to vehicle")
    
    print("Severity assessment complete.")
    return d.get(pred_label[0], 'Unknown')  # Return severity


# Main function to run the damage evaluation pipeline
def engine(img_path):
    # Step 1: Prepare image for VGG16 (224x224)
    img_244 = prepare_img_244(img_path)
    g1 = car_categories_gate(img_244, first_gate)
    
    if not g1:
        result = {'gate1': 'Car validation check: ', 
                  'gate1_result': 0, 
                  'gate1_message': {0: 'Are you sure this is a picture of your car? Please retry your submission.', 
                                    1: 'Hint: Try zooming in/out, using a different angle or different lighting'},
                  'gate2': None,
                  'gate2_result': None,
                  'gate2_message': {0: None, 1: None},
                  'location': None,
                  'severity': None,
                  'final': 'Damage assessment unsuccessful!'}
        return result

    # Step 2: Prepare image for damage detection (256x256)
    img_256 = prepare_img_256(img_path)
    g2 = car_damage_gate(img_256, second_gate)
    
    if not g2:
        result = {'gate1': 'Car validation check: ', 
                  'gate1_result': 1, 
                  'gate1_message': {0: None, 1: None},
                  'gate2': 'Damage presence check: ',
                  'gate2_result': 0,
                  'gate2_message': {0: 'Are you sure that your car is damaged? Please retry your submission.',
                                   1: 'Hint: Try zooming in/out, using a different angle or different lighting.'},
                  'location': None,
                  'severity': None,
                  'final': 'Damage assessment unsuccessful!'}
        return result

    # Step 3: Determine location and severity
    x = location_assessment(img_256, location_model)
    y = severity_assessment(img_256, severity_model)

    # Final result
    result = {'gate1': 'Car validation check: ', 
              'gate1_result': 1, 
              'gate1_message': {0: None, 1: None},
              'gate2': 'Damage presence check: ',
              'gate2_result': 1,
              'gate2_message': {0: None, 1: None},
              'location': x,
              'severity': y,
              'final': 'Damage assessment complete!'}
    return result

