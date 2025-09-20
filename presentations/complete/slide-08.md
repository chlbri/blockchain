# SLIDE 8 : Machine d'états blockchain

## Machine d'états de transaction

![Machine états](./images/slide-8/state-machine.png)

# **🤖 Machine d'états de transaction**

## États principaux :

![États](./images/slide-8/states-diagram.png)

1. **`idle`** - État initial
2. **`checking`** - Vérification en ligne + récupération intermédiaires
3. **`working`** - Prêt pour les opérations
   - **`working/idle`** - Prêt à ajouter des intermédiaires
   - **`working/adding`** - Ajout d'intermédiaire en cours

## Limites intelligentes :

![Limites](./images/slide-8/limits.png)

- **≤ 200,000,000 Francs CFA** : Maximum 3 intermédiaires
- **200,000,000 - 3,000,000,000 Francs CFA** : Maximum 5 intermédiaires
- **> 3,000,000,000 Francs CFA** : Maximum 7 intermédiaires

---

### 📸 **Images requises :**

- `./images/slide-8/state-machine.png` - Diagramme machine d'états XState
- `./images/slide-8/states-diagram.png` - États avec transitions
- `./images/slide-8/limits.png` - Tableau des limites par valeur
