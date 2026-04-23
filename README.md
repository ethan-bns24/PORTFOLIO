# Portfolio

Portfolio statique d'Ethan Binisti, orienté recrutement R&D.

## Stack

- HTML statique
- CSS externe dans `assets/styles.css`
- JavaScript externe dans `assets/app.js`
- Nginx pour le conteneur de prod

## Lancer en local

Serveur simple :

```bash
cd PORTFOLIO
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

Option Docker :

```bash
cd PORTFOLIO
docker build -t ethan-portfolio .
docker run --rm -p 8080:80 ethan-portfolio
```

Puis ouvrir `http://localhost:8080`.

## Structure

- `index.html` : structure et contenu
- `assets/styles.css` : styles
- `assets/app.js` : interactions, i18n, démos, tracking local
- `media/` : poster UAV et médias dérivés
- `social/og-image.svg` : source de l'image de partage
- `social/og-image.png` : image de partage rasterisée
- `favicon.svg` : favicon

## Notes produit

 - La démo UAV charge le GIF lourd uniquement à l'ouverture de la démo (pas au chargement initial de la page).
- Le notebook fissures est aussi fourni en HTML pour être lisible dans un navigateur : `crack-detection-demo.html` (généré à partir de `crack-detection-demo.ipynb`).
- Un suivi analytics local très léger est stocké dans `localStorage` pour compter les CTA et l'ouverture des démos.
- Le portfolio est bilingue FR / EN.

## À adapter après déploiement

- Renseigner une URL canonique définitive si le domaine final est connu.
- Si un encodeur vidéo est disponible, remplacer `uav-landing-demo.gif` par un `mp4/webm`.
- Si tu branches un vrai outil d'analytics, remplace le tracking local par un endpoint ou un service externe.
