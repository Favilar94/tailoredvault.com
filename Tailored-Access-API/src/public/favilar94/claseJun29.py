class Matriz:

  def __init__(self,lst):
    self.row = len(lst)
    self.column = len(lst[0])
    self.A = lst

  def printMatrix(self):
    
    stringM = ''

    for i in range(self.row):
      stringM += ('|' + ', '.join( map(lambda x:'{0:8.3f}'.format(x), self.A[i])) + '| \n')

    print(stringM)

  def add(self, otherM):
    lst = []
    for i in range(0,self.row):
      rowlist = []
      for j in range(0,self.column):
        rowlist.append(self.A[i][j] + otherM.A[i][j])
      lst.append(rowlist)

    return Matriz(lst)

  def mult(self, multiplicador):
    lst= []
    for i in range(0,self.row):
        rowlist = []
        for j in range(0,self.column):
            rowlist.append(self.A[i][j]*multiplicador)
        lst.append(rowlist)
    self.A = lst


lista = [[12,12,22],[1,23,43],[21,23,234]]

matriz = Matriz(lista)
print(matriz.printMatrix())
matriz.mult(2)
print(matriz.printMatrix())

