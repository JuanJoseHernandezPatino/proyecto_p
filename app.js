const express = require("express");
const app = express();
const bodyP = require("body-parser")
const port = 3000;
app.use(bodyP.urlencoded({ extended: false }))
app.use(bodyP.json());

global.vendidos = [];
global.tipo = [];
global.cont = 0;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/datos", (req, res) => {
    res.sendFile(__dirname + "/datos.html")
})

app.post("/ingresarTipoP", (req, res) => {
    let nTipo = global.tipo;
    let conta = global.cont;

    conta++

    nTipo.push({ "id": conta, "producto": req.body[0], "precio": req.body[1], "cantidad": req.body[2] });
    global.cont = conta
    global.tipo = nTipo
    console.log(global.tipo);
    res.send("guardado")
})

app.post("/vender", (req, res) => {
    //productos disponibles
    let productos = global.tipo;
    let pVendido = global.vendidos;


    let idVendido = req.body[0];
    let cantidad = req.body[1];
    let datosProductos = [];
    let datosVentas = [];
    let bande = false;

    productos.forEach(ele => {
        if (ele.id == idVendido) {
            if (pVendido.length == 0) {
                pVendido.push({ "id": ele.id, "producto": ele.producto, "precio": ele.precio, "cantidad": cantidad })
                ele.cantidad = ele.cantidad - cantidad;
            }
            else {
                pVendido.forEach(p => {
                    if (p.id == idVendido) {
                        p.cantidad = Number(p.cantidad) + Number(cantidad);
                        ele.cantidad = ele.cantidad - cantidad;
                        bande = true;
                    }
                });
                if (bande == false) {
                    pVendido.push({ "id": ele.id, "producto": ele.producto, "precio": ele.precio, "cantidad": cantidad })
                    ele.cantidad = ele.cantidad - cantidad;
                }
            }
        }

    });

    let datosModificados = productos.slice();
    let index = datosModificados.findIndex(el => el.cantidad == "0");
    if (index >= 0) {
        datosModificados.splice(index, 1);
    }


    global.tipo = datosModificados;
    global.vendidos = pVendido;
    res.send("Venta exitosa")
})

app.get("/productosD", (req, res) => {
    let productos = global.tipo;
    res.send(productos)
})

app.get("/productosV", (req, res) => {
    let productos = global.vendidos;
    res.send(productos)
})


app.listen(port, () => {
    console.log("puerto: " + port);
})