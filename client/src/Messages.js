let conseilsDouche = [
    {
        texte: "Votre consommation d'eau pour une douche a dépassé 29 litres d'eau: n'attendez pas que l’eau soit chaude pour commencer à vous laver."
    },
    {
        texte: "Vous avez utilisé plus de 29 litres d'eau aujourd'hui pour une seule douche : ne chantez pas sous la douche plus de 5 minutes."
    },
    {
        texte: "Votre douche a consommé plus de 29 litres d'eau: vous devriez choisir une pomme de douche homologuée Water-Sense."
    }
];

let conseilsToilette = [
    {
        texte: "Votre toilette a dépassé 18 litres d'eau pour une seule chasse : vous devriez changer pour une toilette écologique qui consomme moins."
    },
    {
        texte: "Votre toilette a dépensée plus de 18 litres d'eau pour une seule chasse : vous pourriez ajouter au réservoir une bouteille pleine de deux litres pour diminuer le volume d’eau."
    }
]

let felicitations = [
    {
        texte: "Votre consommation est économique, continuez comme ça! Vous contribuez à diminuer les coûts d'eau potable de votre municipalité!"
    },
    {
        texte: "Votre consommation est éco-responsable, bravo! Vous assurez un avenir meilleur aux générations futures."
    },
    {
        texte: "Votre consommation respecte l'environnement, wow! Petit à petit, vous aidez la planète."
    },
]

let conseilsEnsemble = [
    {
        texte: "Votre consommation journalière dépasse les 365 litres d'eau : vous dépassez l’objectif fixé par la ville de Trois-Rivières."
    },
    {
        texte: "Votre consommation est très élevée : vous avez utilisé plus de 365 litres d'eau aujourd'hui. Vos habitudes nuisent au développement durable de la ville."
    },
    {
        texte: "Votre consommation coûte cher : votre utilisation sollicite les usines de traitement des eaux."
    },
    {
        texte: "Vous avez utilisé plus de 365 litres d'eau aujourd'hui : avez-vous pensé à ne tirez la chasse qu'une seule fois si possible?"
    },
]


module.exports = {
    conseilsDouche: conseilsDouche,
    conseilsToilette: conseilsToilette,
    conseilsEnsemble: conseilsEnsemble,
    felicitations: felicitations
}