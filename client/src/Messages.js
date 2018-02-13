let conseilsDouche = [
    {
        texte: "Votre consommation d'eau pour une douche a d�pass� 29 litres d'eau: n'attendez pas que l�eau soit chaude pour commencer � vous laver."
    },
    {
        texte: "Vous avez utilis� plus de 29 litres d'eau aujourd'hui pour une seule douche : ne chantez pas sous la douche plus de 5 minutes."
    },
    {
        texte: "Votre douche a consomm� plus de 29 litres d'eau: vous devriez choisir une pomme de douche homologu�e Water-Sense."
    }
];

let conseilsToilette = [
    {
        texte: "Votre toilette a d�pass� 18 litres d'eau pour une seule chasse : vous devriez changer pour une toilette �cologique qui consomme moins."
    },
    {
        texte: "Votre toilette a d�pens�e plus de 18 litres d'eau pour une seule chasse : vous pourriez ajouter au r�servoir une bouteille pleine de deux litres pour diminuer le volume d�eau."
    }
]

let felicitations = [
    {
        texte: "Votre consommation est �conomique, continuez comme �a! Vous contribuez � diminuer les co�ts d'eau potable de votre municipalit�!"
    },
    {
        texte: "Votre consommation est �co-responsable, bravo! Vous assurez un avenir meilleur aux g�n�rations futures."
    },
    {
        texte: "Votre consommation respecte l'environnement, wow! Petit � petit, vous aidez la plan�te."
    },
]

let conseilsEnsemble = [
    {
        texte: "Votre consommation journali�re d�passe les 365 litres d'eau : vous d�passez l�objectif fix� par la ville de Trois-Rivi�res."
    },
    {
        texte: "Votre consommation est tr�s �lev�e : vous avez utilis� plus de 365 litres d'eau aujourd'hui. Vos habitudes nuisent au d�veloppement durable de la ville."
    },
    {
        texte: "Votre consommation co�te cher : votre utilisation sollicite les usines de traitement des eaux."
    },
    {
        texte: "Vous avez utilis� plus de 365 litres d'eau aujourd'hui : avez-vous pens� � ne tirez la chasse qu'une seule fois si possible?"
    },
]


module.exports = {
    conseilsDouche: conseilsDouche,
    conseilsToilette: conseilsToilette,
    conseilsEnsemble: conseilsEnsemble,
    felicitations: felicitations
}