import { Dialogue } from "../models/dialogue.model";

export const defeatDialog: Dialogue[] = [
    {
        text: '¡Oh, vaya, vaya! ¿De verdad pensaste que podrías vencerme? ¿Que serías lo suficientemente listo para superar este reto?',
        isCharacterVisible: true,
        isEnd: false
    },
    {
        text: 'Pues no... Lamento decepcionarte, pero aquí termina tu intento. Prepárate para una eternidad en [b]el infierno tech[/b].',
        isCharacterVisible: true,
        isEnd: false
    },
    {
        text: 'Un lugar donde no existe el dark mode, donde las horas extras se pagan con pizza y el [b]Burnout[/b] es el pan de cada día.',
        isCharacterVisible: true,
        isEnd: false
    },
    {
        text: '¡Bienvenido a tu nueva realidad de sufrimiento eterno!',
        isCharacterVisible: true,
        isEnd: false
    },
    {
        text: 'Ah, y un pequeño consejo para tu próxima vida: nunca, jamás, firmes contratos sin leerlo previamente... aunque, bueno, ya es un poco tarde para ti, ¿no?',
        isCharacterVisible: true,
        isEnd: true
    }
];


export const victoryDialog: Dialogue[] = [
    {
        text: '¿Qué? ¡¿Cómo es posible que lo hayas logrado?! Esto no estaba en mis planes...',
        isCharacterVisible: true,
        isEnd: false
    },
    {
        text: '¡GRRRRRRRR! ¡ESTO NO PUEDE ESTAR PASANDO!',
        isCharacterVisible: true,
        isEnd: false
    },
    {
        text: 'Supongo que eso es todo, las reglas son reglas. Pero no creas que esto es el final, siempre estaré observándote... desde las sombras.',
        isCharacterVisible: true,
        isEnd: false
    },
    {
        text: 'Disfruta tu libertad... mientras dure. Nos volveremos a ver, eso te lo garantizo.',
        isCharacterVisible: true,
        isEnd: true
    }
];

