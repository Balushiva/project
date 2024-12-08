const API_BASE_URL = 'https://your-api-endpoint.com';
let currentPage = 1;


async function fetchTransactions(month, page = 1, search = '') {
  const response = await fetch(`${API_BASE_URL}/transactions?month=${month}&page=${page}&search=${search}`);
  return response.json();
}


async function fetchStatistics(month) {
  const response = await fetch(`${API_BASE_URL}/statistics?month=${month}`);
  return response.json();
}


async function fetchChartData(month) {
  const response = await fetch(`${API_BASE_URL}/chart-data?month=${month}`);
  return response.json();
}


function updateTable(data) {
  const tbody = document.getElementById('transactions-body');
  tbody.innerHTML = ''; // Clear table
  data.forEach(item => {
    const row = `
      <tr>
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.description}</td>
        <td>${item.price}</td>
        <td>${item.category}</td>
        <td>${item.sold ? 'Yes' : 'No'}</td>
        <td><img src="${item.image}" alt="Image" style="width:50px;"></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}


function updateStatistics(data) {
  document.getElementById('total-sale').textContent = data.totalSale;
  document.getElementById('total-sold').textContent = data.totalSoldItems;
  document.getElementById('total-not-sold').textContent = data.totalNotSoldItems;
}


function renderChart(data) {
  const ctx = document.getElementById('bar-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.priceRanges,
      datasets: [{
        label: 'Items',
        data: data.items,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
    }
  });
}

document.getElementById('month-select').addEventListener('change', async (event) => {
  const month = event.target.value;
  const transactions = await fetchTransactions(month);
  const statistics = await fetchStatistics(month);
  const chartData = await fetchChartData(month);

  updateTable(transactions);
  updateStatistics(statistics);
  renderChart(chartData);
});

document.getElementById('search').addEventListener('input', async (event) => {
  const search = event.target.value;
  const month = document.getElementById('month-select').value;
  const transactions = await fetchTransactions(month, currentPage, search);
  updateTable(transactions);
});

document.getElementById('prev').addEventListener('click', async () => {
  if (currentPage > 1) {
    currentPage--;
    const month = document.getElementById('month-select').value;
    const transactions = await fetchTransactions(month, currentPage);
    updateTable(transactions);
    document.getElementById('current-page').textContent = currentPage;
  }
});

document.getElementById('next').addEventListener('click', async () => {
  currentPage++;
  const month = document.getElementById('month-select').value;
  const transactions = await fetchTransactions(month, currentPage);
  updateTable(transactions);
  document.getElementById('current-page').textContent = currentPage;
});
