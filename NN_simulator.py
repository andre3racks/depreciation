import sys, time, json, random

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    # lines = read_in()


    for i in range(10):
        time.sleep(1)
        
        d = {}
        d['price'] = random.randint(400, 100000)
        d['odo'] = random.randint(400, 100000)
        d['age'] = random.randint(1, 30)
        print(json.dumps(d))
        
        

#start process
if __name__ == '__main__':
    main()