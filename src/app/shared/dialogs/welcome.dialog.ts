import { Dialogue } from '../models/dialogue.model';

export const welcomeDialog: Dialogue[] = [
    {
        text: ' ¿Hola? (puedo sentir la presencia de alguien) [/n] ¿Hay alguien ahí? Sé que estás ahí, no seas tímido',
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'Bienvenido a la habitación del espejo, yo soy... un [b]ÁNGEL[/b]... sí, un [b]ÁNGEL[/b] , y solo porque me has caído bien, [/n] te dejaré usar mi espejo',
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'Es un espejo mágico que te teletransportará al lugar en el que siempre deseaste estar (JAJAJAJAJAJA) [/n] Ven, te mostraré cómo funciona.',
        isCharacterVisible: false,
        isEnd: false
    }
];   
