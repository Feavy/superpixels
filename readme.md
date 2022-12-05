1. Histoire du seuil   (distance euclidienne entre le germe avant et après déplacement < 10 pixels => on arrête)
1. Histoire du gradient (on calcule le gradient sur un voisinage 5*5 ou 7*7 => on prend le pixel qui a le gradient le plus petit)
1. Histoire de la connectivité
1. Histoire de la segmentation binaire
1. Histoire d'optimisation : pour chaque germe itérer uniquement à tarvers les 2S*2S pixels autour
1. Histoire de comment trouver les paramètres ; à quoi ils servent