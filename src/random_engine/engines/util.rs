pub fn inverse_exponential(rate: f32) -> f32 {
    let u: f32 = rand::random::<f32>();
    -(1.0 - u).ln() / rate
}
