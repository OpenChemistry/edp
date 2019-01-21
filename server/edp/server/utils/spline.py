import numpy as np
from scipy.interpolate import UnivariateSpline as Spline

def make_models(data, ks, smooth):
    model = {}
    for key in data.keys():
        for k in ks:
            spl = smooth_spline(data, key, k, smooth)
            keep_prev = False
            prev_spl = model.get(key, None)
            if prev_spl is not None:
                # Check number of nodes:
                m = len(prev_spl.get_knots())
                n = len(spl.get_knots())
                if m < n:
                    keep_prev = True
                elif m == n:
                    r = prev_spl.get_residual()
                    s = spl.get_residual()
                    if r < s:
                        keep_prev = True

            if not keep_prev:
                model[key] = spl

    for key in model.keys():
        params = model[key]._eval_args
        model[key] = {
            'knots': list(params[0]),
            'coeffs': list(params[1]),
            'k': params[2]
        }

    return model

def smooth_spline(data, key, k, smooth):
    span = max(data[key]) - min(data[key])
    y = np.array(data[key])
    x = np.linspace(0, 1, num=len(y), endpoint=False)
    spl = Spline(x, y, k=k, s=smooth * span * k)
    return spl
