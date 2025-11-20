const API_KEY = '50137b0abb5b5cabf5f93d0acd214acb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // URL para pôsters

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieResults = document.getElementById('movie-results');

// 1. Função para buscar filmes na API
async function SearchMovies(query){

    // Monta a URL da API para busca de filmes
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    try{

        movieResults.innerHTML = `<p class="initial-message">Buscando filmes...</p>`;

        const response = await fetch(url);

        // Verifica se a resposta foi bem-sucedida (status 200)
        if(!response.ok){

            throw new Error(`Erro na API: ${response.status}`);

        }

        const data = await response.json();

        // Chama a função para exibir os resultados
        DisplayMovies(data.results);

    }

    catch(error){

        console.error('Erro ao buscar filmes: ', error);

        movieResults.innerHTML = `
        
            <p class="error-message">
            
                Ocorreu um erro ao buscar os filmes: ${error.message}.
                Verifique sua chave de API e sua conexão.

            </p>
        
        `;

    }

}

// 2. Função para exibir os resultados na tela
function DisplayMovies(movies){

    movieResults.innerHTML = ''; // Limpa os resultados anteriores

    if(movies.length === 0){

        movieResults.innerHTML = `
        
            <p class="initial-message">
                Nenhum filme encontrado com este termo. Tente uma busca diferente!
            </p>

        `;

        return;

    }

    // Itera sobre a lista de filmes
    movies.forEach(movie => {

        // Pula filmes sem pôster ou título
        if(!movie.poster_path || !movie.title) return;

        // Monta a URL completa do pôster. Se não houver, usa uma imagem placeholder.
        const posterUrl = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Pôster';

        // Cria o elemento HTML para o card do filme
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Define o conteúdo HTML do card
        movieCard.innerHTML = `
        
            <img src="${posterUrl}" alt="${movie.title} Pôster">
            <div class="movie-info">
            
                <h3>${movie.title}</h3>
                <p>
                
                    Lançamento: ${movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                
                </p>

                <p>
                
                    Avaliação: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} ⭐
                
                </p>
            
            </div>
        
        `;

        // Adiciona o card à área de resultados
        movieResults.appendChild(movieCard);

    });

}

// 3. Adiciona o listener de evento ao formulário de busca
searchForm.addEventListener('submit', (e) => {

    e.preventDefault(); // Impede o recarregamento da página

    const query = searchInput.value.trim();

    if(query){

        SearchMovies(query);

    }

    else{

        // Se a busca estiver vazia, limpa os resultados e mostra a mensagem inicial
        movieResults.innerHTML = '<p class="initial-message">Use a barra de busca acima para encontrar seus filmes favoritos!</p>';

    }

});

// Busca filmes populares ao carregar a página
async function FetchPopularMovies(){

    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;

    try{

        movieResults.innerHTML = '<p class="initial-message">Carregando filmes populares...</p>';
        const response = await fetch(url);
        const data = await response.json();
        DisplayMovies(data.results);

    }

    catch(error){

        console.error('Erro ao carregar populares: ', error);

    }

}

// Carrega os filmes populares ao iniciar
FetchPopularMovies();