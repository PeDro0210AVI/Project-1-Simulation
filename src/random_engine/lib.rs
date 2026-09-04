mod engines;
use pyo3::prelude::*;

/// Reinicia el generador con la semilla dada, para hacer reproducible la simulacion.
/// Al importar el modulo ya queda sembrado con DEFAULT_SEED = 123.
#[pyfunction]
fn set_seed(seed: u64) {
    engines::set_seed(seed);
}

/// Semilla con la que arranca el modulo.
#[pyfunction]
fn default_seed() -> u64 {
    engines::DEFAULT_SEED
}

#[pyfunction]
fn poisson_arrival(rate: f32) -> f32 {
    engines::poisson_process_arrival(rate)
}

#[pyfunction]
fn customer_quantity(regular_rate: f32, wholesale_rate: f32) -> (f32, bool) {
    let result = engines::customer_quantity(regular_rate, wholesale_rate);
    (result.get_quantity(), result.get_is_wholesale())
}

#[pyfunction]
fn regular_quantity_inverse(rate: f32) -> f32 {
    engines::regular_quantity_inverse(rate)
}

#[pyfunction]
fn regular_quantity_accept_reject(rate: f32) -> (f32, u32) {
    let result = engines::regular_quantity_accept_reject(rate);
    (result.get_value(), result.get_attempts())
}

#[pymodule]
fn random_engine(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(set_seed, m)?)?;
    m.add_function(wrap_pyfunction!(default_seed, m)?)?;
    m.add_function(wrap_pyfunction!(poisson_arrival, m)?)?;
    m.add_function(wrap_pyfunction!(customer_quantity, m)?)?;
    m.add_function(wrap_pyfunction!(regular_quantity_inverse, m)?)?;
    m.add_function(wrap_pyfunction!(regular_quantity_accept_reject, m)?)?;
    m.add("DEFAULT_SEED", engines::DEFAULT_SEED)?;
    Ok(())
}
