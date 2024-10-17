import { Dialogue } from '../models/dialogue.model';

export const uploadDialog: Dialogue[] = [
    {
        text: `Así que te llamas ${localStorage.getItem('name')}, un placer conocerte, estoy seguro de que no te arrepentirás de haber firmado el contrato. [/n] (Espero no haya leído los [b]Términos y Condiciones[/b])`,
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'Empecemos con esto, primero haz que tu [b]reflejo[/b] se vea en el espejo',
        isCharacterVisible: false,
        isEnd: false
    }
];

export const uploadError1: Dialogue[] = [
    {
        text: `Al parecer el [b]reflejo[/b] que has utilizado no es válido, inténtalo nuevamente`,
        isCharacterVisible: false,
        isEnd: false
    }
];  

export const uploadError2: Dialogue[] = [
    {
        text: `.... Esto es vergonzoso, espero no estés intentando engañarme, pero no puedo seguir sin un [b]reflejo[/b] válido`,
        isCharacterVisible: false,
        isEnd: false
    }
];  

export const uploadError3: Dialogue[] = [
    {
        text: `!GRRRRRRRRR¡ Ya me has hecho enojar, esta es tu [b]última oportunidad[/b] [/n]`,
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: `Tu cara debe aparecer en el [b]reflejo[/b] y debe estar lo suficientemente clara para que sea detectada por mi magia [/n] [b]Mas te vale que no intentes engañarme nuevamente[/b]`,
        isCharacterVisible: false,
        isEnd: false
    }
]; 
