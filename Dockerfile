#   _____  _    _ _   _ 
#  |  __ \| |  | | \ | |
#  | |__) | |  | |  \| |
#  |  _  /| |  | | . ` |
#  | | \ \| |__| | |\  |
#  |_|  \_\\____/|_| \_|
#   
FROM nginx:alpine AS RUNNER 
COPY nginx.conf /etc/nginx/nginx.conf
COPY .dist/dev /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
