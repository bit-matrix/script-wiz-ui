// ref -> https://github.com/MrMaxweII/Secp256k1-Calculator/blob/master/Secp256k1.java

import bigInt from 'big-integer';

export const p = bigInt('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16);
export const ModuloHalb = bigInt('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFE17', 16);
const ORDNUNG = bigInt('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);

export const ZERO = bigInt(0);
const ONE = bigInt(1);
const TWO = bigInt(2);
export const THREE = bigInt(3);
const FOUR = bigInt(4);
export const SEVEN = bigInt(7);

export const add = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return a.add(b).mod(p);
};

export const neg = (a: bigInt.BigInteger) => {
  return p.subtract(a);
};

export const sub = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return add(a, neg(b));
};

export const mul = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return a.multiply(b).mod(p);
};

export const inv = (a: bigInt.BigInteger) => {
  return a.modInv(p);
};

export const div = (a: bigInt.BigInteger, b: bigInt.BigInteger) => {
  return mul(a, inv(b));
};

export const abs = (a: bigInt.BigInteger) => {
  if (a.compareTo(p.subtract(ONE).divide(TWO)) === 1) return neg(a);
  return a;
};

export const pow = (x: bigInt.BigInteger, n: bigInt.BigInteger) => {
  return x.modPow(n, p);
};

export const sqrt = (n: bigInt.BigInteger) => {
  let s = ZERO;
  let q = p.subtract(ONE);
  while (q.and(ONE).equals(ZERO)) {
    q = q.divide(TWO);
    s = s.add(ONE);
  }
  if (s.equals(ONE)) {
    let r = pow(n, p.add(ONE).divide(FOUR));
    if (r.multiply(r).mod(p).equals(n)) return abs(r);
  }

  // Find the first quadratic non-residue z by brute-force search
  let z = ZERO;
  while (pow((z = z.add(ONE)), p.subtract(ONE).divide(TWO)).equals(p.subtract(ONE)) === false);
  let c = pow(z, q);
  let r = pow(n, q.add(ONE).divide(TWO));
  let t = pow(n, q);
  let m = s;
  while (t.equals(ONE) === false) {
    let tt = t;
    let i = ZERO;
    while (tt.equals(ONE) === false) {
      tt = tt.multiply(tt).mod(p);
      i = i.add(ONE);
      if (i.equals(m)) {
        if (n.equals(ZERO) === false) console.log('Error');
        return ZERO;
      }
    }
    let b = pow(c, pow(TWO, m.subtract(i).subtract(ONE)));
    let b2 = b.multiply(b).mod(p);
    r = r.multiply(b).mod(p);
    t = t.multiply(b2).mod(p);
    c = b2;
    m = i;
  }
  if (r.multiply(r).mod(p).equals(n)) return abs(r);
  return ZERO;
};

export const multiply_2 = (P: bigInt.BigInteger[]) => {
  let erg = [];
  let m = div(mul(THREE, pow(P[0], TWO)), mul(TWO, sqrt(add(pow(P[0], THREE), SEVEN))));
  if (P[1].compareTo(ModuloHalb) === 1) m = neg(m);
  let n = sub(P[1], mul(m, P[0]));
  erg[0] = sub(pow(m, TWO), mul(TWO, P[0]));
  erg[1] = neg(add(mul(m, erg[0]), n));
  return erg;
};

export const addition = (po1: bigInt.BigInteger[], po2: bigInt.BigInteger[]) => {
  let nullVektor = [];
  nullVektor[0] = bigInt('0', 16);
  nullVektor[1] = bigInt('0', 16);
  if (po1[0].equals(ZERO) && po1[1].equals(ZERO)) return po2;
  if (po2[0].equals(ZERO) && po2[1].equals(ZERO)) return po1;
  if (po2[1].equals(po1[1])) return multiply_2(po1);
  else if (po2[0].equals(po1[0])) return nullVektor;
  let erg = [];
  let m = div(sub(po2[1], po1[1]), sub(po2[0], po1[0]));
  let n = sub(po1[1], mul(m, po1[0]));
  erg[0] = sub(sub(mul(m, m), po1[0]), po2[0]);
  erg[1] = neg(add(mul(m, erg[0]), n));
  return erg;
};

export const negOrder = (a: bigInt.BigInteger) => {
  return ORDNUNG.subtract(a);
};
