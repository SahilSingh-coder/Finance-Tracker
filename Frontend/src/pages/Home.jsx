import { Link } from "react-router-dom"

function Home() {
    return (
        <div className="home">

            {/* HERO SECTION */}

            <section className="home-hero">

                <div className="hero-content">

                    <p className="hero-badge">
                        PERSONAL FINANCE MANAGEMENT
                    </p>

                    <h1>
                        Take control of
                        <span> your money.</span>
                    </h1>

                    <p className="hero-description">
                        Track your income, expenses and spending habits
                        in one simple dashboard. Make better financial
                        decisions with clear analytics.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/dashboard"
                            className="primary-button"
                        >
                            Go to Dashboard
                        </Link>

                        <Link
                            to="/transactions"
                            className="secondary-button"
                        >
                            View Transactions
                        </Link>

                    </div>

                </div>

            </section>


            {/* FEATURES */}

            <section className="features">

                <div className="section-heading">

                    <p>
                        EVERYTHING YOU NEED
                    </p>

                    <h2>
                        Manage your finances with confidence.
                    </h2>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            ₹
                        </div>

                        <h3>
                            Track Transactions
                        </h3>

                        <p>
                            Easily record your income and expenses
                            and keep your financial activity organized.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ↗
                        </div>

                        <h3>
                            Understand Your Spending
                        </h3>

                        <p>
                            See where your money goes with
                            category-based expense analytics.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ✓
                        </div>

                        <h3>
                            Stay In Control
                        </h3>

                        <p>
                            Monitor your balance, income and expenses
                            from one simple dashboard.
                        </p>

                    </div>

                </div>

            </section>


            {/* CTA */}

            <section className="home-cta">

                <h2>
                    Start managing your money today.
                </h2>

                <p>
                    Your financial overview is just one click away.
                </p>

                <Link
                    to="/dashboard"
                    className="primary-button"
                >
                    Open Dashboard
                </Link>

            </section>


            {/* FOOTER */}

            <footer className="home-footer">

                <p>
                    © 2026 Finance Tracker
                    <span className="footer-divider">•</span>
                    Designed &amp; Developed by
                    <strong> Sahil Singh</strong>
                </p>

            </footer>

        </div>
    )
}

export default Home