import { useEffect, useState } from 'react'
import { TrendingUp, RefreshCw, DollarSign, Euro, MapPin, Globe } from 'lucide-react'
import { getCurrencies } from '../../../shared/api/currency'
import toast from 'react-hot-toast'

const CURRENCY_ICONS = {
    USD: <DollarSign className="w-5 h-5" />,
    GTQ: <MapPin className="w-5 h-5" />, // Representando local de Guatemala
    EUR: <Euro className="w-5 h-5" />,
    MXN: <Globe className="w-5 h-5" />,
    COP: <Globe className="w-5 h-5" />,
    JPY: <TrendingUp className="w-5 h-5" />
}

const CURRENCY_NAMES = {
    USD: 'Dólar Estadounidense',
    GTQ: 'Quetzal Guatemalteco',
    EUR: 'Euro',
    MXN: 'Peso Mexicano',
    COP: 'Peso Colombiano',
    JPY: 'Yen Japonés'
}

export const CurrencyDashboard = ({ allowedCurrencies }) => {
    const [rates, setRates] = useState({})
    const [loading, setLoading] = useState(true)
    const [base, setBase] = useState('USD')
    const [lastUpdate, setLastUpdate] = useState(null)
    const [amount, setAmount] = useState(1) // Nueva cantidad para convertir

    const fetchRates = async () => {
        setLoading(true)
        try {
            const data = await getCurrencies(base)
            if (data.success) {
                setRates(data.rates)
                setLastUpdate(data.lastUpdate)
            }
        } catch (error) {
            toast.error(error.message || 'Error al actualizar divisas')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial + auto-refresh por intervalo
        fetchRates()
        // Auto-refresh cada 5 minutos
        const interval = setInterval(fetchRates, 300000)
        return () => clearInterval(interval)
    }, [base])

    // Filtrar las divisas a mostrar si el componente recibe allowedCurrencies
    const displayedRates = Object.entries(rates).filter(([code]) => {
        if (!allowedCurrencies || allowedCurrencies.length === 0) return true;
        // Siempre mostramos la moneda base + las monedas permitidas
        return allowedCurrencies.includes(code) || code === base;
    });

    return (
        <section className="space-y-6">
            {/* Control Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-[2rem] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-lg backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[var(--theme-text)]">Mercado en Vivo</h3>
                        <p className="text-xs text-[var(--theme-text-muted)]">Actualizado: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '---'}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--theme-surface-alt)] border border-[var(--theme-border)]">
                        <span className="text-sm font-bold text-[var(--theme-text-muted)]">{base}</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-24 bg-transparent text-[var(--theme-text)] font-bold focus:outline-none"
                            placeholder="Cantidad"
                        />
                    </div>

                    <select 
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-[var(--theme-surface-alt)] border border-[var(--theme-border)] text-[var(--theme-text)] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        {Object.keys(CURRENCY_NAMES).map(code => (
                            <option key={code} value={code}>{code} - {CURRENCY_NAMES[code]}</option>
                        ))}
                    </select>

                    <button 
                        onClick={fetchRates}
                        disabled={loading}
                        className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 group"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </button>
                </div>
            </div>

            {/* Rates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedRates.map(([code, rate]) => (
                    <div 
                        key={code}
                        className="group relative overflow-hidden p-6 rounded-[2rem] border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
                                    {CURRENCY_ICONS[code] || <Globe className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[var(--theme-text)]">{code}</h4>
                                    <p className="text-xs font-medium text-[var(--theme-text-muted)] uppercase tracking-wider">
                                        {CURRENCY_NAMES[code] || 'Divisa'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-[var(--theme-text)] tracking-tight">
                                    {(rate * amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <p className="text-[10px] text-[var(--theme-text-muted)] font-medium">
                                    {amount} {base} = {(rate * amount).toFixed(2)} {code}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar (Visual decoration) */}
                        <div className="mt-6 w-full h-1.5 bg-[var(--theme-surface-alt)] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-60" 
                                style={{ width: `${Math.min((rate / 20) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
