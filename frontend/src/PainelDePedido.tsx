import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = 'https://backend-ternos.onrender.com';
const tamanhos = ['44', '46', '48', '50', '52'];

export default function PainelDePedido() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [cores, setCores] = useState([]);
  const [grade, setGrade] = useState({});
  const [logado, setLogado] = useState(!!localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(null);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', tipo: 'vendedor' });

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) setUsuario(JSON.parse(stored));
    if (logado) {
      axios.get(`${API_BASE}/api/clientes`).then(res => setClientes(res.data));
      axios.get(`${API_BASE}/api/produtos`).then(res => setProdutos(res.data));
      carregarRelatorios();
      axios.get(`${API_BASE}/api/relatorios/estoque`).then(res => setEstoque(res.data));
    }
  }, [logado]);

  const carregarRelatorios = () => {
    const params = {
      cliente: filtroCliente,
      produto: filtroProduto,
      data_inicio: filtroDataInicio,
      data_fim: filtroDataFim,
    };
    axios.get(`${API_BASE}/api/relatorios/vendas`, { params }).then(res => setRelatorios(res.data));
  };

  useEffect(() => {
    if (produtoSelecionado) {
      axios.get(`${API_BASE}/api/produtos/${produtoSelecionado}/cores`).then(res => setCores(res.data));
    }
  }, [produtoSelecionado]);

  const handleInput = (cor, tamanho, value) => {
    setGrade(prev => ({
      ...prev,
      [cor]: {
        ...prev[cor],
        [tamanho]: value,
      },
    }));
  };

  const salvarPedido = () => {
    const itens = [];
    Object.entries(grade).forEach(([cor, tamanhosMap]) => {
      Object.entries(tamanhosMap).forEach(([tamanho, quantidade]) => {
        if (quantidade > 0) {
          itens.push({ cor, tamanho, quantidade });
        }
      });
    });

    axios.post(`${API_BASE}/api/pedidos`, {
      cliente_id: clienteSelecionado,
      produto_id: produtoSelecionado,
      itens,
    }).then((res) => {
      alert('Pedido salvo com sucesso.');
      window.open(`${API_BASE}/api/pedidos/${res.data.pedido_id}/pdf`, '_blank');
    });
  };

  const realizarLogin = () => {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    axios.post(`${API_BASE}/api/login`, { usuario, senha }).then(res => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      setUsuario(res.data.usuario);
      setLogado(true);
    });
  };

  const realizarLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setLogado(false);
    setUsuario(null);
  };

  const registrarNovoUsuario = () => {
    axios.post(`${API_BASE}/api/usuarios`, novoUsuario).then(() => {
      alert('Usuário cadastrado com sucesso.');
      setNovoUsuario({ nome: '', email: '', senha: '', tipo: 'vendedor' });
    });
  };

  const vendasData = {
    labels: relatorios.map(r => `${r.produto} - ${r.cor} - ${r.tamanho}`),
    datasets: [
      {
        label: 'Total Vendido',
        data: relatorios.map(r => r.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sistema de Pedidos</h1>
    </div>
  );
}
