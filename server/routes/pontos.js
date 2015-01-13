exports.findAll = function(req, res) {
    res.send( [
    {
      "cx": 1900,
      "cy": 10,
      "salic": "54321-9",
      "projeto": "Batman",
      "color":"blue"
    },
    {
      "cx": 15000.05,
      "cy": 20,
      "salic": "12345-20",
      "projeto": "Minha mãe é uma peça",
      "color":"blue"
    },
    {
      "cx": 5000,
      "cy": 10,
      "salic": "123-90",
      "projeto": "Ipsum Lorem",
      "color":"blue"
    },
    {
      "cx": 3000,
      "cy": 20,
      "salic": "90783-10",
      "projeto": "Inception",
      "color":"blue"
    },
    {
      "cx": 1000,
      "cy": 20,
      "salic": "111111-22",
      "projeto": "Uma mente brilhante",
      "color":"blue"
    },
    {
      "cx": 10000.00,
      "cy": 10,
      "salic": "33333-44",
      "projeto": "Os outros",
      "color":"red"
    }
    ]);
};
