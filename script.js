import { ESPLoader, Transport } from "https://unpkg.com/esptool-js@0.4.5/bundle.js"

let firmware = null
let port
let esploader

async function compileCode(){

document.getElementById("status").innerText = "Compiling..."

const code = document.getElementById("code").value

const response = await fetch("http://localhost:5000/compile",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({code})
})

firmware = await response.arrayBuffer()

document.getElementById("status").innerText="Firmware Ready"
}

window.connectBoard = async function(){

port = await navigator.serial.requestPort()

await port.open({ baudRate:115200 })

const transport = new Transport(port)

esploader = new ESPLoader({
transport,
baudrate:115200
})

await esploader.main()

document.getElementById("status").innerText="ESP Connected"
}

window.flashFirmware = async function(){

document.getElementById("status").innerText="Flashing..."

await esploader.writeFlash({
fileArray:[
{
data:new Uint8Array(firmware),
address:0x1000
}
]
})

document.getElementById("status").innerText="Flash Complete"
}
