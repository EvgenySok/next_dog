/**
 * Sets a array of errors for formik form via a ref
 *
 * @param errors {email: "There is an error with email"}
 * @param ref - reference to formik component
 * @param map - maps error keys to the correct fields
 */

export function useSetFormikErrors(errors, ref, map) {
  useEffect(
    () => {
      /*
       * Maps keys to the correct filed names, e.g. if
       * we supply a map of { firstName: "newFieldName" }
       * the 'firstName' error will be set on the 'newFieldName'
       * field.
       */
      const mappedErrors = _mapKeys(errors, (value, key) => {
        return _get(map, key, key) || key;
      });

      if (!_isNil(errors)) ref.current.setErrors(mappedErrors);
    },
    [errors]
  );
}