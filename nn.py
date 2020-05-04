import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
import tensorflow as tf
import sys, time, json, random, keras
import numpy as np

# vars for ranging data for input to NN
odo_max = 8718636
condition_max = 4
price_max = 4198286601
age_max = 240

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():

    vehicle = read_in()
    vehicle = np.asarray(vehicle)

    price_predictor = keras.models.load_model('dataset/price_prediction.hdf5')

    augmented_vehicle_list = encode_input(vehicle)

    prediction = price_predictor.predict(augmented_vehicle_list)
    # prediction = price_predictor.predict(vehicle)
    print(prediction*price_max)

def encode_input(vehicle):

    # assumes order is age, condition, odo, make, model
    vehicle_attr_list = []
    condition = vehicle[1]

    for odo in range(int(vehicle[2]), int(vehicle[2]) + 150000, 15000):
        for age in range(int(vehicle[0]), int(vehicle[0] + 20), 2):
            contents = [age/age_max, condition/condition_max, odo/odo_max]
            contents.extend(vehicle[3:])
            vehicle_attr_list.append(contents)

    vehicle_attr_list = np.asarray(vehicle_attr_list)
    vehicle_attr_list = np.reshape(vehicle_attr_list, (100,755))

    print(vehicle_attr_list[0])

    return vehicle_attr_list

#start process
if __name__ == '__main__':    
    main()