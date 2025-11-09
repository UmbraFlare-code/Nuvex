# Usa Arch Linux como base
FROM archlinux:latest

# Instalación de dependencias del sistema (ajusta según lo que necesite tu aplicación)
RUN pacman -Syu --noconfirm \
    && pacman -S --noconfirm base-devel git \
    && pacman -S --noconfirm nodejs npm \
    && pacman -Scc --noconfirm

# Crear el directorio de la aplicación
WORKDIR /app

# Copiar package.json y package-lock.json / yarn.lock si los tienes
COPY package*.json ./

# Instalar dependencias de Node (si es un proyecto NodeJS)
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto que tu aplicación usa (ajusta si es otro puerto)
EXPOSE 3000

# Comando para arrancar la app (ajusta si tu app se inicia con otro comando)
CMD ["npm", "start"]
