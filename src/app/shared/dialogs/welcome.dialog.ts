import { Dialogue } from '../models/dialogue.model';

export const welcomeDialog: Dialogue[] = [
    {
        text: '¿Hola? ¿Hola? (puedo sentir la presencia de alguien) [/n] ¿Hay alguien ahí?',
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'No puedo verte bien, acércate un poco más, no seas tímido [/n] Yo soy.... un [b]ÁNGEL[/b]... sí, un [b]ÁNGEL[/b]',
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'Bienvenido a la habitación del espejo, supongo que has venido a conocer su poder... [/n] ¿Que no lo conocías?',
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'Es un espejo mágico que posee el poder de teletransportar a la persona que se refleje en el a un bello lugar en el que siempre ha deseado estar (JAJAJAJAJAJA) [/n]',
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'Ven te mostraré cómo funciona, solo debes firmar el siguiente contrato, no te molestes en leerlo, no es gran cosa, pero son requisitos ya sabes',
        isCharacterVisible: false,
        isEnd: false
    }
];   
