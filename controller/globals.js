const Db = require('../config/db');

class Globals {
    constructor() {
        this.db = new Db();
        this.tempoJogo = {
            segundos: 0,
            minutos: 0,
            horas: 0,
            dias: 0
        };
    }

    async obterTempoSalvo() {
        const sql = 'SELECT * FROM tempo_jogo WHERE id=1';
        const results = await this.db.query(sql);

        // Simular um atraso de 1 segundo (1000 milissegundos)
        await new Promise(resolve => setTimeout(resolve, 50));

        if (results.length > 0) {
            const tempoSalvo = results[0];

            this.tempoJogo = {
                segundos: tempoSalvo.segundos || 0,
                minutos: tempoSalvo.minutos || 0,
                horas: tempoSalvo.horas || 0,
                dias: tempoSalvo.dias || 0
            };
        }

        return this.tempoJogo; // Retornar o tempo armazenado na instância
    }

    async salvarTempo(segundos, minutos, horas, dias) {
        const sql = `UPDATE tempo_jogo SET segundos=${segundos}, minutos=${minutos}, horas=${horas}, dias=${dias} WHERE id=1`;
        const results = await this.db.query(sql);
        //console.log("Tempo salvo");
    }

    async iniciarCronometro() {
        await this.obterTempoSalvo();
        console.log("Cronometro iniciado");

        const intervaloTempo = setInterval(async () => {
            this.tempoJogo.segundos++;

            if (this.tempoJogo.segundos === 60) {
                this.tempoJogo.segundos = 0;
                this.tempoJogo.minutos++;

                if (this.tempoJogo.minutos === 60) {
                    this.tempoJogo.minutos = 0;
                    this.tempoJogo.horas++;

                    if (this.tempoJogo.horas === 24) {
                        this.tempoJogo.horas = 0;
                        this.tempoJogo.dias++;
                    }
                }
            }

            await this.salvarTempo(this.tempoJogo.segundos, this.tempoJogo.minutos, this.tempoJogo.horas, this.tempoJogo.dias);
        }, 1000);
        console.log("Cronometro salvo");
    }

    // Função para atualizar estamina de jogadores
    async atualizarEstaminaJogadores() {
        try {
            // Lógica para obter jogadores com estamina < 100
            const results = await this.db.query('SELECT * FROM jogadores WHERE estamina < 100');

            // Atualize a estamina de cada jogador
            for (const jogador of results) {
                await this.db.query('UPDATE jogadores SET estamina = ? WHERE id = ?', [jogador.estamina + 1, jogador.id]);
            }

            console.log('Estamina de jogadores atualizada com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar estamina de jogadores:', error);
        }
    }

    async ranking(req, res) {
        try {
          const sql = 'SELECT * FROM jogadores';
          const results = await this.db.query(sql);
      
          res.json({ players: results });
        } catch (error) {
          console.error('Erro ao executar a consulta:', error);
          res.status(500).send('Erro interno no servidor');
        }
      };
      

}

module.exports = Globals;
