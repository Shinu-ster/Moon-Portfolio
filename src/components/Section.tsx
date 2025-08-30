export default function Section({ children, id, className = ''}){
    return (
        <section
            id={id}
            className={`flex items-center justify-center min-h-screen px-6  text-white ${className}`}>
                <div className="max-w-4xl text-center">{children}</div>
            </section>
    )
}