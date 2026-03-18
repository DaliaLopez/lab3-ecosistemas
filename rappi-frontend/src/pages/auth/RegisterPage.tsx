import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/auth.types';
import { register } from '../../services/auth.service';
import axios, { AxiosError } from 'axios';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: UserRole.CONSUMER as UserRole,
        storeName: ''
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (formData.password.length < 6) {
            setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            await register(formData);
            alert("¡Registro exitoso!");
            navigate('/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;

                console.error("Error en registro:", axiosError.response?.data);

                if (axiosError.response?.status === 400 || axiosError.response?.status === 409) {
                    setErrorMessage("El correo electrónico ya está registrado o los datos son inválidos.");
                } else {
                    setErrorMessage("Ocurrió un error inesperado en el servidor.");
                }
            } else {
                setErrorMessage("Error de conexión o de aplicación.");
            }
        };
    };

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 w-full max-w-md flex flex-col gap-4">

                    <h2 className="text-2xl font-semibold text-center text-gray-800">
                        Crear cuenta
                    </h2>

                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100">
                            {errorMessage}
                        </div>
                    )}

                    <input
                        className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400"
                        type="text"
                        placeholder="Nombre"
                        required
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />

                    <input
                        className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400"
                        type="email"
                        placeholder="Email"
                        required
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400"
                        type="password"
                        placeholder="Contraseña"
                        required
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />

                    <select
                        className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    >
                        <option value={UserRole.CONSUMER}>Cliente</option>
                        <option value={UserRole.STORE}>Tienda</option>
                        <option value={UserRole.DELIVERY}>Repartidor</option>
                    </select>

                    {formData.role === UserRole.STORE && (
                        <input
                            className="border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:border-orange-400"
                            type="text"
                            placeholder="Nombre de la tienda"
                            required
                            onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                        />
                    )}

                    <button
                        type="submit"
                        className="bg-orange-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition mt-2"
                    >
                        Registrarse
                    </button>

                </form>

            </div>
        );
    };