import { useState } from 'react'
import { FiSave, FiAlertCircle } from 'react-icons/fi'

export default function AdminAjustes() {
    const [settings, setSettings] = useState({
        systemName: 'Synergia Portal',
        supportEmail: 'soporte@synergia.com',
        calendarUrl: 'https://calendly.com/synergia/30min',
        themeColor: '#0052cc',
        maintenanceMode: false
    })

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        // Mock save
        alert('Ajustes guardados correctamente')
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Ajustes del Sistema</h1>
                <p className="page-subtitle">Configuración global de la plataforma</p>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    
                    {/* General */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">General</h3>
                        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            <div>
                                <label className="label">Nombre del Sistema</label>
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={settings.systemName}
                                    onChange={e => handleChange('systemName', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">Email de Soporte</label>
                                <input 
                                    type="email" 
                                    className="input" 
                                    value={settings.supportEmail}
                                    onChange={e => handleChange('supportEmail', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Integraciones */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Integraciones</h3>
                        <div>
                            <label className="label">URL Calendario Por Defecto</label>
                            <input 
                                type="url" 
                                className="input" 
                                value={settings.calendarUrl}
                                onChange={e => handleChange('calendarUrl', e.target.value)}
                                placeholder="https://calendly.com/..."
                            />
                            <p className="text-xs text-muted mt-1">Se usará cuando el consultor no tenga uno configurado</p>
                        </div>
                    </div>

                     <hr />

                    {/* Branding */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Branding</h3>
                        <div>
                            <label className="label">Color Principal</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                <input 
                                    type="color" 
                                    value={settings.themeColor}
                                    onChange={e => handleChange('themeColor', e.target.value)}
                                    style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                                />
                                <span className="text-sm font-mono">{settings.themeColor}</span>
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Peligro */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-error">Zona de Peligro</h3>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="maintenance"
                                checked={settings.maintenanceMode}
                                onChange={e => handleChange('maintenanceMode', e.target.checked)}
                            />
                            <label htmlFor="maintenance" className="label" style={{ marginBottom: 0 }}>Modo Mantenimiento</label>
                        </div>
                        <p className="text-xs text-muted mt-1">Si activas esto, solo los administradores podrán acceder al portal.</p>
                    </div>

                </div>
                <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn--primary" onClick={handleSave}>
                        <FiSave /> Guardar Ajustes
                    </button>
                </div>
            </div>
        </div>
    )
}
