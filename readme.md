1. Histoire du gradient (on calcule le gradient sur un voisinage 5x5 ou 7x7 => on prend le pixel qui a le gradient le plus petit)
1. Histoire de la connectivité
1. Histoire d'optimisation : pour chaque germe itérer uniquement à tarvers les 2S*2S pixels autour
1. Histoire de comment trouver les paramètres ; à quoi ils servent

## Comment trouver les paramètres ?
    m est le poids donné à la distance euclidienne.
    Plus on donne d'importance à la distance euclidienne et moins on en donne à la différence de couleurs (si on a une image avec une teinte similaire), plus on donnera une valeur importante à m.
    Si on veut plutôt privilégier la différence de couleurs, on va réduire m.

    N est le nombre de superpixels, plus on en met, plus la détection de contours sera précise mais le calcul sera plus long.

    On cherche ensuite les paramètres de manière empirique.
