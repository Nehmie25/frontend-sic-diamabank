# [frontend-sic-diamabank]

Bienvenue sur le dépôt du projet **[frontend-sic-diamabank]**.
Ceci est une application web moderne construite avec [Next.js](https://nextjs.org/).

## 🚨 Stratégie de Branches (Git Workflow)

**ATTENTION : Nous ne travaillons pas directement sur `main`.**

* 🔴 **`main`** : Contient uniquement la version stable / production. Ne jamais push directement ici.
* 🟢 **`dev`** : C'est la branche principale de développement. **Toutes les nouvelles fonctionnalités partent d'ici et reviennent ici.**

### Comment travailler :

1.  Assurez-vous d'être sur la branche `dev` :
    ```bash
    git checkout dev
    git pull origin dev
    ```
2.  Créez votre branche de fonctionnalité à partir de `dev` :
    ```bash
    git checkout -b feature/ma-nouvelle-fonctionnalite
    ```
3.  Une fois terminé, faites une Pull Request (PR) vers **`dev`**.

---

## 🛠 Technologies utilisées

* **Framework :** [Next.js](https://nextjs.org/) (React)
* **Langage :** JavaScript / TypeScript
* **Styles :** Tailwind CSS
* **Gestionnaire de paquets :** npm / yarn / pnpm

---

## 🚀 Pour commencer

Suivez ces instructions pour installer et lancer le projet en local.

### 1. Prérequis

* [Node.js](https://nodejs.org/) (Version 18+ recommandée)
* Git

### 2. Installation

Clonez le dépôt et installez les dépendances :

```bash
# Cloner le projet (si ce n'est pas déjà fait)
git clone git@github.com:Nehmie25/frontend-sic-diamabank.git

# Aller dans le dossier
cd [NOM_DU_DOSSIER]

# Basculer sur la branche de dev
git checkout dev

# Installer les dépendances
npm install
# ou
yarn install