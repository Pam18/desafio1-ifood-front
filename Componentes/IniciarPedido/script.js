import { alerta } from "../util.js";
import { defineUrlBase as urlBase } from "../util.js";
import { tokenExpirado } from "../util.js";

window.setInterval(() => {
    window.location.reload();
}, 60000);

const token = localStorage.getItem('token');
const pedidoString = localStorage.getItem('Dados do pedido');
const pedidoObj = JSON.parse(pedidoString);
const idPedido = pedidoObj.codigoPedido;
const idEntregador = localStorage.getItem('idEntregador');
const iniciarCorrida = document.querySelector('button');

let logout = document.querySelector('.logout');

const linkApi = `${urlBase()}/pedidos/aceitar/${idPedido}`;
const pedidoNaTela = document.querySelector('div .card-pedido');
pedidoNaTela.textContent = `Pedido: #${pedidoObj.codigoPedido}`;
const nomeCliente = document.querySelector('div .card-cliente');
nomeCliente.textContent = `Cliente: ${pedidoObj.cliente.nome}`;

logout.addEventListener('click', () => {
    sairAplicacao();
})

iniciarCorrida.addEventListener(('click'), () => {
    enviosDeDados();
});

function enviosDeDados() {
    if (!idEntregador) {
        alerta(".alert-danger", "Problemas no pedido.")
        return;
    }
    try {
        fetch(`${linkApi}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                "Accept": "application/json",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                idEntregador: parseInt(idEntregador)
            })
        }).then((resposta) => {
            console.log(resposta)
            switch (resposta.status) {
                case 404:
                    alerta(".alert-warning", resposta.error.mensagem);
                    break;
                case 409:
                    alerta(".alert-warning", resposta.error.mensagem);
                    break;
                case 400:
                    alerta(".alert-warning", resposta.error.mensagem);
                    break;
                case 401:
                    alerta(".alert-danger",
                        "Você não tem autorização para acessar esse recurso! CLIQUE AQUI.",
                        true);
                    break;
                default:
                    window.location.href = '../ConfirmarCancelar/index.html'
                    return;
            }
        });
    } catch (error) {
        alerta(`.alert-danger`, `Problemas com o pedido. ${error.mensagem}`)
        return;
    }
}
