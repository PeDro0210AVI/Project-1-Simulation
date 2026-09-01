mod util;

pub fn inverse_exponential(rate: f32) -> f32 {
    let u: f32 = rand::random::<f32>();
    -(1.0 - u).ln() / rate
}
pub fn poisson_process_arrival(rate: f32) -> f32 {
    util::inverse_exponential(rate)
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
    let u = rand::random::<f32>();

    if u < 0.9 {
        QuantityResult {
            quantity: util::inverse_exponential(regular_rate),
            is_wholesale: false,
        }
    } else {
        QuantityResult {
            quantity: util::inverse_exponential(wholesale_rate),
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

pub fn regular_quantity_inverse(rate: f32) -> f32 {
    util::inverse_exponential(rate)
}

pub fn regular_quantity_accept_reject(rate: f32) -> AcceptRejectResult {
    let envelope_rate = rate / 2.0;
    let mut attempts: u32 = 0;

    loop {
        attempts += 1;

        let y = util::inverse_exponential(envelope_rate);
        let u: f32 = rand::random::<f32>();

        if u <= (-(rate - envelope_rate) * y).exp() {
            return AcceptRejectResult { value: y, attempts };
        }
    }
}

//ACCEPT_REJECT
