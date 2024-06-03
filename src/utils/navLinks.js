const navLinks = () => {
    const routes = [];
    routes.push({
        to: '/',
        text: 'Home',
        private: false
    });

    routes.push({
        to: '/contacts',
        text: 'Contactos',
        private: false
    });
    
    routes.push({
        to: '/orders',
        text: 'Ordenes',
        private: false
    });
    
    routes.push({
        to: '/Finance',
        text: 'Finanzas',
        private: false
    });

    routes.push({
        to: '/inventory',
        text: 'Inventario',        
        private: false
    });
    routes.push({
        to: '/config',
        text: 'Configuracion',        
        private: false
    });

    return routes

}

export default navLinks