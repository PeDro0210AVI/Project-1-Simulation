use rand::rngs::StdRng;
use rand::{RngExt, SeedableRng};
use std::cell::RefCell;

//SEED

/// Semilla por defecto del motor. Fijarla hace que toda la simulacion sea
/// reproducible: dos corridas con la misma semilla producen exactamente los
/// mismos numeros.
pub const DEFAULT_SEED: u64 = 123;

thread_local! {
    static RNG: RefCell<StdRng> = RefCell::new(StdRng::seed_from_u64(DEFAULT_SEED));
}

/// Reinicia el generador con la semilla dada.
pub fn set_seed(seed: u64) {
    RNG.with(|rng| *rng.borrow_mut() = StdRng::seed_from_u64(seed));
}

/// Unico punto donde se consume aleatoriedad: U ~ Uniforme[0, 1).
fn uniform() -> f32 {
    RNG.with(|rng| rng.borrow_mut().random::<f32>())
}

//SEED

fn inverse_exponential(rate: f32) -> f32 {
    let u: f32 = uniform();
    -(1.0 - u).ln() / rate
}

//POISSON

// funny wrapper for simulation
pub fn poisson_process_arrival(rate: f32) -> f32 {
    inverse_exponential(rate)
}

//POISSON

//COMPOSITION
#[derive(Clone, Copy)]
pub(crate) struct QuantityResult {
    quantity: f32,
    is_wholesale: bool,
}

impl QuantityResult {
    pub fn get_quantity(self) -> f32 {
        self.quantity
    }
    pub fn get_is_wholesale(self) -> bool {
        self.is_wholesale
    }
}

pub fn customer_quantity(regular_rate: f32, wholesale_rate: f32) -> QuantityResult {
    let u = uniform();

    if u < 0.9 {
        QuantityResult {
            quantity: inverse_exponential(regular_rate),
            is_wholesale: false,
        }
    } else {
        QuantityResult {
            quantity: inverse_exponential(wholesale_rate),
            is_wholesale: true,
        }
    }
}

//COMPOSITION

//ACCEPT_REJECT
#[derive(Clone, Copy)]
pub(crate) struct AcceptRejectResult {
    value: f32,
    attempts: u32,
}

impl AcceptRejectResult {
    pub fn get_value(self) -> f32 {
        self.value
    }
    pub fn get_attempts(self) -> u32 {
        self.attempts
    }
}

// funny wrapper for simulation in the inverse
pub fn regular_quantity_inverse(rate: f32) -> f32 {
    inverse_exponential(rate)
}

pub fn regular_quantity_accept_reject(rate: f32) -> AcceptRejectResult {
    let envelope_rate = rate / 2.0;
    let mut attempts: u32 = 0;

    loop {
        attempts += 1;

        let y = inverse_exponential(envelope_rate);
        let u: f32 = uniform();

        if u <= (-(rate - envelope_rate) * y).exp() {
            return AcceptRejectResult { value: y, attempts };
        }
    }
}

//ACCEPT_REJECT
