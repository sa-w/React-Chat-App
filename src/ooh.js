
const output = arr => {
    let result = {}
    let newArr = []
    let strArr = arr.split(' AND ')
    let val
    let temp = []
    let res = []
    for (i = 0; i < strArr.length; i++) {
        val = strArr[i]

        if (val.includes('OR')) {
            temp = val.split('OR')

            res = []

            for (x = 0; x < temp.length; x++) {

                res.push(parseInt(temp[x].match(/\d/g).toString().replace(/,/g, '')))

            }

            newArr.push({
                or: res
            })

        } else {

            newArr.push(parseInt(val.match(/\d/g).toString().replace(/,/g, '')))

        }

    }

    console.log(newArr)

    result.and = newArr

    return JSON.stringify(result)
}

let result = output("{1069} AND ({1070} OR {1071} OR {1072}) AND {1244} AND ({1245} OR {1339})")

console.log(result)

