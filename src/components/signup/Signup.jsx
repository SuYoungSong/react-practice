import './signup.css'
import {Alert, Button, Card, CardContent, CardHeader, Grid, Snackbar, TextField, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import {useState, useRef} from "react";

const FIELD = [
  {label: "아이디", name: "userId"},
  {label: "비밀번호", name: "userPw", type: "password", gridSize: 6, defaultMsg: "8~20자이며 영문, 숫자, 특수문자를 포함해야 합니다."},
  {label: "비밀번호 확인", name: "userPwConfirm", type: "password", gridSize: 6},
  {label: "이메일", name: "userEmail", required: false},
]

const FIELD_ERR_MSG = {
  userId: {
    invalidLength: "5자리 이상 입력해야 합니다.",
    invalidFormat: "영문과 숫자로만 구성되어야 합니다.",
  },
  userPw: {
    invalidFormat: "8~20자이며 영문, 숫자, 특수문자를 포함해야 합니다."
  },
  userPwConfirm: {
    passwordMismatch: "비밀번호가 일치하지 않습니다."
  },
  userEmail: {
    invalidFormat: "이메일 형식이 올바르지 않습니다."
  }
}

export default function Signup({ onClose }) {
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [fieldValue, setFieldValue] = useState({})
  const [fieldErrMsg, setFieldErrMsg] = useState({})
  const fieldRefs = useRef({});

  const validateUserId = userId => {
    if (userId.length < 5) return FIELD_ERR_MSG.userId.invalidLength;

    const idRegex = /^[A-Za-z0-9]+$/
    if (!idRegex.test(userId)) return FIELD_ERR_MSG.userId.invalidFormat;
  };

  const validateUserPw = userPw => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(userPw)) return FIELD_ERR_MSG.userPw.invalidFormat;
  };

  const validateuserPwConfirm = ((userPwConfirm, userPw) => {
    if (userPwConfirm !== userPw) return FIELD_ERR_MSG.userPwConfirm.passwordMismatch;
  });

  const validateUserEmail = userEmail => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(userEmail)) return FIELD_ERR_MSG.userEmail.invalidFormat;
  };

  const getFieldErrMsg = (name, value, allValues) => {
    if (!value) return "";
    if (name === "userId") return validateUserId(value);
    if (name === "userPwConfirm") return validateuserPwConfirm(value, allValues.userPw);
    if (name === "userEmail") return validateUserEmail(value);
    if (name === "userPw") return validateUserPw(value);
  }

  const validateField = (name, value) => {
    const errMsg = getFieldErrMsg(name, value, fieldValue);
    setFieldErrMsg(prev => ({ ...prev, [name]: errMsg }));

    if (name === "userPw" && fieldValue.userPwConfirm) {
      validateField("userPwConfirm", fieldValue.userPwConfirm);
    }
  }

  const openSnackbar = (msg, severity) => setSnackbar({ open: true, message: msg, severity: severity || "success" });

  const closeSnackbar = () => setSnackbar({ open: false, message: "" });

  const handleFieldChange = e => {
    const { name, value } = e.target;

    setFieldValue(prev => ({ ...prev, [name]: value.toUpperCase() }));
    if (fieldErrMsg[name]) validateField(name, value);
  }

  const handleFieldBlur = e => validateField(e.target.name, e.target.value);

  const handleSignupClick = () => {
    const errMsg = {};

    FIELD.forEach(field => {
      const isRequired = field.required ?? true;
      const value = fieldValue[field.name];

      if (isRequired && !value) {
        errMsg[field.name] = `${field.label}은(는) 필수 입력 항목입니다.`;
      }

      if (value) {
        errMsg[field.name] = getFieldErrMsg(field.name, value, fieldValue);
      }
    })

    if (Object.values(errMsg).some(Boolean)) {
      setFieldErrMsg(errMsg);

      const firstErrorField = FIELD.find(field => errMsg[field.name]);
      if (firstErrorField && fieldRefs.current[firstErrorField.name]) {
        fieldRefs.current[firstErrorField.name].focus();
      }
      return;
    }

    openSnackbar("신규 가입 완료");
    setIsSignupSuccess(true);
  }

  return (
    <>
      <Card className="signup-root">
        <CardHeader
          title={<Typography variant="h6">회원가입</Typography>}
          action={<Close onClick={onClose} />}/>
        <CardContent>
          <Grid container columns={12} spacing={2}>
            {FIELD.map((field, idx) => (
              <Grid key={idx} size={field.gridSize || 12}>
                <TextField
                  fullWidth
                  type={field.type ?? "text"}
                  label={field.label}
                  name={field.name}
                  value={fieldValue[field.name]}
                  onChange={handleFieldChange}
                  onBlur={handleFieldBlur}
                  helperText={fieldErrMsg[field.name] || field.defaultMsg || ""}
                  error={!!fieldErrMsg[field.name]}
                  required={field.required ?? true}
                  inputRef={el => fieldRefs.current[field.name] = el}
                  disabled={isSignupSuccess}
                />
              </Grid>
            ))}
            <Grid size={12} >
              <Button
                variant="contained"
                fullWidth
                disabled={isSignupSuccess}
                onClick={handleSignupClick}
              >
                {isSignupSuccess ? '가입완료' : '가입하기'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}