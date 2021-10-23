#Room 2
class punto:
    '''clase para graficar un punto'''
    __posX = 0
    __posY = 0

    def __init__(self, x, y):
        self.__posX = x
        self.__posY = y

    def getX(self):
        return self.__posX
    def getY(self):
        return self.__posY
    
    def getDistancia(self):
        distancia = ((self.__posX**2) + (self.__posY**2))**(1/2)
        return distancia

pointsValuest = [
    [10,10],
    [3,3],
    [5,5],
    [3,4]
]
pointsObjects = []
for point in pointsValuest:
    pointsObjects.append(punto(point[0],point[1]))

for object in pointsObjects:
    print('(X={}, Y={}) Distancia {:.2f}'.format(object.getX(), object.getY(),object.getDistancia()))
