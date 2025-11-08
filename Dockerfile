FROM archlinux:latest

# Actualizar e instalar Node + NPM
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm nodejs npm git && \
    pacman -Scc --noconfirm

# Crear carpeta de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --production=false

# Copiar resto del código del proyecto
COPY . .

# Generar build de Next.js (.next/)
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio en producción
CMD ["npm", "start"]
