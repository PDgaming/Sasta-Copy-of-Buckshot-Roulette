import chalk from 'chalk';
import inquirer from 'inquirer';

let playerName;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    console.log(chalk.bgRed('Welcome to Sasta Buckshot Roulett'));
    await sleep(2000);

    console.log(`You will have to sign this contract before proceeding.
***Contract***
Sign your name here`);

    await askName();
    await sleep(1000);
    await rules(); // Corrected function name
    await sleep(2000);
    await firstRound();
}

async function askName() {
    const answers = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',
        default() {
            return 'Player';
        },
    });
    playerName = answers.player_name;
}

async function rules() { // Corrected function name
    console.log(`You will be provided with a gun and an option to shoot yourself or the dealer.
The gun will be loaded with either a real round or an empty round,
You and the Dealer will both get 3 lives,
Your goal is to kill the Dealer before he kills you.
Good Luck!!`);
}

let dealerLives = 3;
let playerLives = 3;
let onToNext = false;

async function firstRound() {
    console.log(chalk.bgRed('The First Round Begins!!'));
    console.log(`Dealer Lives: ${dealerLives} Player Lives: ${playerLives}`);
    await choice1();

    async function choice1() {
        let emptyRound = await randomRound(); // Use `await` for randomness
        console.log(emptyRound);

        const answers = await inquirer.prompt({
            name: 'choice1',
            type: 'list',
            message: 'Who to shoot?',
            choices: ['You', 'Dealer'],
        });

        const choice1answer = answers.choice1;
        await handleAnswer(choice1answer, emptyRound);
        await sleep(1000);
        if (onToNext) {
            await choice1();
        }
    }

    async function handleAnswer(isCorrect, emptyRound) {
        if (isCorrect === 'You') {
            if (emptyRound) {
                console.log('You are safe!!');
            } else {
                console.log('You Died');
                playerDeath();
            }
        } else {
            if (emptyRound) {
                console.log('It was an empty round!');
            } else {
                console.log('You killed the Dealer!');
                dealerDeath();
            }
        }

        console.log(`Dealer Lives: ${dealerLives} Player Lives: ${playerLives}`);
        if (dealerLives === 0) {
            console.log("You win!!")
            process.exit(0);
        } else if (playerLives === 0) {
            console.log("You lost.")
            process.exit(0)
        } else {
            onToNext = true;
        }
    }

    async function randomRound() {
        return Math.random() < 0.5;
    }

    async function playerDeath() {
        playerLives--;
    }

    async function dealerDeath() {
        dealerLives--;
    }
}

welcome();