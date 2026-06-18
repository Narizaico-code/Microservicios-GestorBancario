import transactionsImage from '../../../assets/Transacciones-image.png'

export const TransactionInfoCard = ({ title, description, alt }) => (
  <div className="overflow-hidden rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow)]">
    <div className="h-28 bg-[var(--theme-surface-alt)]">
      <img src={transactionsImage} alt={alt} className="h-full w-full object-cover opacity-80 mix-blend-luminosity" />
    </div>
    <div className="m-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-4 text-sky-700 dark:text-sky-300">
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-1 text-sm opacity-90">{description}</p>
    </div>
  </div>
)
