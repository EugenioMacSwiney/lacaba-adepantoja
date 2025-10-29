
class AdminReservas {
    constructor() {
        this.reservas = [];
        this.filtros = {
            fecha: '',
            estado: '',
            busqueda: ''
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.cargarReservas();
        this.setupNavigation();
    }

    setupEventListeners() {

        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });


        document.getElementById('filter-fecha').addEventListener('change', (e) => {
            this.filtros.fecha = e.target.value;
            this.filtrarReservas();
        });

        document.getElementById('filter-estado').addEventListener('change', (e) => {
            this.filtros.estado = e.target.value;
            this.filtrarReservas();
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filtros.busqueda = e.target.value.toLowerCase();
            this.filtrarReservas();
        });

        document.getElementById('clear-filters').addEventListener('click', () => {
            this.limpiarFiltros();
        });


        document.getElementById('nueva-reserva-btn').addEventListener('click', () => {
            this.mostrarModalCrear();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.cerrarModal();
        });

        document.getElementById('cancel-modal').addEventListener('click', () => {
            this.cerrarModal();
        });

        document.getElementById('reserva-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarReserva();
        });


        document.getElementById('logout-btn').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                window.location.href = 'homepage.html';
            }
        });
    }

    setupNavigation() {
        const links = document.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                

                links.forEach(l => {
                    l.classList.remove('bg-orange-50', 'text-orange-600', 'border-orange-600');
                    l.classList.add('border-transparent');
                });
                

                link.classList.add('bg-orange-50', 'text-orange-600', 'border-orange-600');
                link.classList.remove('border-transparent');
                

                if (window.innerWidth < 768) {
                    document.querySelector('.sidebar').classList.remove('open');
                }
            });
        });
    }

    async cargarReservas() {
        try {
            this.mostrarLoading(true);
            const response = await fetch('server.php?action=get_reservas');
            const data = await response.json();
            
            if (data.reservas) {
                this.reservas = data.reservas;
                this.mostrarReservas();
                this.actualizarEstadisticas();
            }
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            this.mostrarError('Error al cargar las reservas');
        } finally {
            this.mostrarLoading(false);
        }
    }

    mostrarReservas(reservasFiltradas = null) {
        const reservas = reservasFiltradas || this.reservas;
        const tbody = document.getElementById('reservas-table-body');
        const noReservas = document.getElementById('no-reservas');
        
        if (reservas.length === 0) {
            tbody.innerHTML = '';
            noReservas.classList.remove('hidden');
            return;
        }
        
        noReservas.classList.add('hidden');
        
        tbody.innerHTML = reservas.map(reserva => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${reserva.numero_reserva}</div>
                    <div class="text-sm text-gray-500">${this.formatearFecha(reserva.fecha_creacion)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${reserva.nombre || 'Sin nombre'}</div>
                    <div class="text-sm text-gray-500">${reserva.email}</div>
                    ${reserva.telefono ? `<div class="text-sm text-gray-500">${reserva.telefono}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${this.formatearFecha(reserva.fecha)}</div>
                    <div class="text-sm text-gray-500">${reserva.hora}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${reserva.personas} persona${reserva.personas !== 1 ? 's' : ''}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${this.getBadgeEstado(reserva.estado)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="admin.editarReserva('${reserva.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="admin.eliminarReserva('${reserva.id}')" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getBadgeEstado(estado) {
        const colores = {
            confirmada: 'bg-green-100 text-green-800',
            pendiente: 'bg-yellow-100 text-yellow-800',
            cancelada: 'bg-red-100 text-red-800',
            completada: 'bg-blue-100 text-blue-800'
        };
        
        const textos = {
            confirmada: 'Confirmada',
            pendiente: 'Pendiente',
            cancelada: 'Cancelada',
            completada: 'Completada'
        };
        
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colores[estado]}">${textos[estado]}</span>`;
    }

    filtrarReservas() {
        let reservasFiltradas = this.reservas;
        
        if (this.filtros.fecha) {
            reservasFiltradas = reservasFiltradas.filter(reserva => 
                reserva.fecha === this.filtros.fecha
            );
        }
        
        if (this.filtros.estado) {
            reservasFiltradas = reservasFiltradas.filter(reserva => 
                reserva.estado === this.filtros.estado
            );
        }
        
        if (this.filtros.busqueda) {
            reservasFiltradas = reservasFiltradas.filter(reserva => 
                reserva.nombre?.toLowerCase().includes(this.filtros.busqueda) ||
                reserva.email.toLowerCase().includes(this.filtros.busqueda) ||
                reserva.numero_reserva.toLowerCase().includes(this.filtros.busqueda)
            );
        }
        
        this.mostrarReservas(reservasFiltradas);
    }

    limpiarFiltros() {
        this.filtros = { fecha: '', estado: '', busqueda: '' };
        document.getElementById('filter-fecha').value = '';
        document.getElementById('filter-estado').value = '';
        document.getElementById('search-input').value = '';
        this.mostrarReservas();
    }

    mostrarModalCrear() {
        document.getElementById('modal-title').textContent = 'Nueva Reserva';
        document.getElementById('reserva-form').reset();
        document.getElementById('reserva-id').value = '';
        document.getElementById('reserva-modal').classList.remove('hidden');
    }

    async editarReserva(id) {
        try {
            const response = await fetch(`server.php?action=get_reserva&id=${id}`);
            const data = await response.json();
            
            if (data.reserva) {
                this.mostrarModalEditar(data.reserva);
            }
        } catch (error) {
            console.error('Error al cargar reserva:', error);
            this.mostrarError('Error al cargar la reserva');
        }
    }

    mostrarModalEditar(reserva) {
        document.getElementById('modal-title').textContent = 'Editar Reserva';
        document.getElementById('reserva-id').value = reserva.id;
        document.getElementById('reserva-nombre').value = reserva.nombre || '';
        document.getElementById('reserva-email').value = reserva.email;
        document.getElementById('reserva-telefono').value = reserva.telefono || '';
        document.getElementById('reserva-fecha').value = reserva.fecha;
        document.getElementById('reserva-hora').value = reserva.hora;
        document.getElementById('reserva-personas').value = reserva.personas;
        document.getElementById('reserva-estado').value = reserva.estado;
        document.getElementById('reserva-comentarios').value = reserva.comentarios || '';
        
        document.getElementById('reserva-modal').classList.remove('hidden');
    }

    cerrarModal() {
        document.getElementById('reserva-modal').classList.add('hidden');
    }

    async guardarReserva() {
        const formData = {
            id: document.getElementById('reserva-id').value,
            nombre: document.getElementById('reserva-nombre').value,
            email: document.getElementById('reserva-email').value,
            telefono: document.getElementById('reserva-telefono').value,
            fecha: document.getElementById('reserva-fecha').value,
            hora: document.getElementById('reserva-hora').value,
            personas: document.getElementById('reserva-personas').