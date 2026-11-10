/* Datos del sitio: edita aquí clases, recursos y carpetas de Drive. */
(function(){const E=window.EX=window.EX||{};
/* URL de la app web de Apps Script (ver backend/INSTALAR.md). Vacío = modo local. */
E.API="https://script.google.com/macros/s/AKfycbxJhdsbR-Y5fARGoZxpMuWdeNcFRmZ1xRysNZpOu5D0EDuuuZ2JMxzNSsOjo7-gd5oHAw/exec";
E.D="https://drive.google.com/drive/folders/";E.Q="?usp=sharing";
E.MAIN="1L0Y35DXJAjRI9rKyvFCCGe1-a1Djw7HQ";E.EXTRA="1a9DdZNDc-syjXQ6br7fqmC04bAa_JCB2";
E.R=[
{id:"tm",n:"Teachable Machine",d:"Entrena modelos de IA con tu cámara, sin programar.",u:"https://teachablemachine.withgoogle.com/",e:"🧠",c:[1]},
{id:"gpt",n:"ChatGPT",d:"Asistente de IA para conversar, pedir ideas y crear imágenes.",u:"https://chatgpt.com/",e:"💬",c:[2,4]},
{id:"flow",n:"Google Flow",d:"Crea escenas y videos con IA a partir de tus ideas.",u:"https://labs.google/flow/",e:"🎞️",c:[2]},
{id:"suno",n:"Suno",d:"Generador de música con IA: crea canciones y sonidos.",u:"https://suno.com/es",e:"🎵",c:[2]},
{id:"scr",n:"Scratch",d:"Crea historias, animaciones y videojuegos con bloques.",u:"https://scratch.mit.edu/",e:"🐱",c:[3]},
{id:"pis",n:"Piskel",d:"Diseña personajes y animaciones en pixel art.",u:"https://www.piskelapp.com/",e:"👾",c:[3]},
{id:"nlm",n:"NotebookLM",d:"Estudia con tus documentos: resúmenes, preguntas y cuestionarios.",u:"https://notebooklm.google.com/",e:"📓",c:[4]},
{id:"xai",n:"Experience AI",d:"Actividades educativas sobre inteligencia artificial.",u:"https://www.experience-ai.org/",e:"🔬",c:[1]},
{id:"une",n:"UNESCO",d:"Orientaciones sobre IA y educación.",u:"https://www.unesco.org/en/digital-education/artificial-intelligence",e:"🌍",c:[4]},
{id:"uni",n:"UNICEF",d:"IA, infancia y derechos digitales.",u:"https://www.unicef.org/innocenti/",e:"🧒",c:[4]}];
E.C=[
{n:1,t:"Descubre el futuro",s:"STEAM e inteligencia artificial",e:"🤖",bg:"linear-gradient(135deg,#16C6D3,#248BFA)",drive:"1bln48ItxgCEz8dTN-pLSeOUVCik4zRxK",tools:["tm"],
 top:["Introducción a STEAM: Ciencia, Tecnología, Ingeniería, Arte y Matemáticas","Importancia de STEAM en la vida cotidiana","¿Qué es la inteligencia artificial?","Ejemplos de IA en nuestro entorno","¿Cómo aprenden las máquinas?","Reconocimiento y clasificación de imágenes"],
 hace:["Breve introducción a STEAM y su relación con la creatividad y la innovación","Exploración de ejemplos de inteligencia artificial","Explicación de cómo una IA aprende a reconocer imágenes","Creación y entrenamiento de un modelo de clasificación con Google Teachable Machine"],prod:"Modelo de clasificación de imágenes"},
{n:2,t:"Da vida a tus ideas",s:"Creatividad multimedia e IA",e:"🎬",bg:"linear-gradient(135deg,#248BFA,#8054E8)",drive:"1ZWI3PfZYHSSHaA6roLjW8mVRAnIS7UkM",tools:["gpt","flow","suno"],
 top:["¿Qué es la multimedia?","Elementos multimedia: imágenes, audio, texto y video","Creatividad y diseño digital","Generación de imágenes con inteligencia artificial","Creación de voces, sonidos y narraciones con herramientas digitales"],
 hace:["Exploración de ejemplos de creaciones multimedia","Creación de personajes o imágenes utilizando IA","Experimentación con herramientas para generar voces, sonidos o narraciones","Integración de los recursos creados en una propuesta multimedia sencilla"],prod:"Creación multimedia"},
{n:3,t:"Crea tu primer videojuego",s:"Imaginación y programación",e:"🎮",bg:"linear-gradient(135deg,#8054E8,#B69AFF)",drive:"130m7Ox8hMjgc8FeCdWC_kdmZj8_Dnn89",tools:["pis","scr"],
 top:["¿Qué es un videojuego y cómo se construye?","Personajes, escenarios y elementos de un videojuego","Introducción al diseño de personajes y sprites","¿Qué es la programación?","Programación visual con Scratch","Secuencias, eventos y movimientos"],
 hace:["Exploración de los componentes de un videojuego","Diseño de personajes y elementos gráficos con Piskel","Introducción al entorno de Scratch","Creación de un videojuego sencillo mediante bloques de programación"],prod:"Videojuego básico en Scratch"},
{n:4,t:"IA con responsabilidad",s:"Aprende, pregunta y piensa",e:"🛡️",bg:"linear-gradient(135deg,#16C6D3,#8054E8)",drive:"1_kJRDqj5WKkkzQ9WYcHOXsNywOxj4gc4",tools:["nlm","gpt"],
 top:["¿Qué es un prompt y cómo comunicarnos con la IA?","Cómo formular instrucciones claras","Uso de documentos como fuentes de información","Cuestionarios, preguntas, resúmenes y presentaciones con IA","Verificación de información y pensamiento crítico","Privacidad, seguridad y uso responsable de la IA"],
 hace:["Explicación de cómo escribir instrucciones para la IA","Entrega de un documento de estudio con información sobre un tema","Uso de NotebookLM u otra herramienta para trabajar con el documento","Creación individual de cuestionarios, preguntas o materiales para estudiar","Uso de los recursos creados para practicar y comprobar lo aprendido","Revisión de las respuestas de la IA frente al documento original"],prod:"Recurso de estudio creado con IA"}];
E.DEMO=[{n:"Clasificador de gestos",d:"Ejemplo de un modelo que reconoce manos arriba y abajo.",c:1,e:"🧠"},{n:"Robo-Gato espacial",d:"Ejemplo de personaje digital.",c:2,e:"🐱"},{n:"Mi robot cuenta un cuento",d:"Ejemplo de video con voz generada.",c:2,e:"🎬"},{n:"Atrapa estrellas",d:"Ejemplo de videojuego hecho en Scratch.",c:3,e:"⭐"},{n:"Mi guía de estudio",d:"Ejemplo de recurso de estudio hecho con IA.",c:4,e:"📓"}];
})();
