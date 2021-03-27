// const impureDouble = (x) => {
//     console.log('doubling', x);
  
//     return x * 2;
//   };
  
//   const result = impureDouble(4);
//   console.log({ result });


const impureAssoc = (key, value, object) => {
    object[key] = value;
  };
  
  const person = {
    name: 'Bobo'
  };
  
  const result = impureAssoc('shoeSize', 400, person);
  
  console.log({
    person,
    result
  });



//   const pureAssoc = (key, value, object) => ({
//     ...object,
//     [key]: value
//   });
  
//   const person = {
//     name: 'Bobo'
//   };
  
//   const result = pureAssoc('shoeSize', 400, person);
  
//   console.log({
//     person,
//     result
//   });