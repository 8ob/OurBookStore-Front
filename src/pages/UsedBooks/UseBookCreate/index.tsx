import React, { useState, useEffect } from 'react';
import {
  usePostApiUsedBooks,
  useGetApiUsedBooksIsbnIsbn,
  PostApiUsedBooksBody
} from '../../../API';
import defaultImage2 from '../../../assets/images/no image available.png';
import backgroundImage from '../../../assets/images/main-slider/about.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import decorate from '../../../assets/images/resource/decorate.jpg';
import { Link, useNavigate } from 'react-router-dom';
import {
  faSearch,
  faCheck,
  faUser,
  faBook,
  faLightbulb,
  faPhotoFilm,
  faImage,
  faStar,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import '../UseBookCreate/Creatstyle.css';
import '../../../assets/css/style.css';
import '../../../assets/css/responsive.css';
import '../../../assets/css/color.css';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DiscountCardContainer from '../../../components/DiscountCardContainer/DiscountCardContainer';

const steps = [
  'Select campaign settings',
  'Create an ad group',
  'Create an ad'
];

const StepContent1 = () => {
  // 第一步的内容
  return <div>第一步的内容...</div>;
};

const StepContent2 = () => {
  // 第二步的内容
  return <div>第二步的内容...</div>;
};

const StepContent3 = () => {
  // 第三步的内容
  return <div>第三步的内容...</div>;
};

const AddUsedBook: React.FC = () => {
  const [isbn, setIsbn] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setSelectedcategory] = useState('');
  const [otherText, setOtherText] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const navigate = useNavigate();

  //步驟
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepContent1 />;
      case 1:
        return <StepContent2 />;
      case 2:
        return <StepContent3 />;
      default:
        return <div>未知步骤</div>;
    }
  };

  //取得書籍API
  const {
    data,
    isLoading: isDataLoading,
    error: dataError,
    refetch
  } = useGetApiUsedBooksIsbnIsbn(isbn);
  //新增書籍API
  const addUsedBook = usePostApiUsedBooks();

  const handleSelectCategoryChange = (event) => {
    setSelectedcategory(event.target.value);
  };
  //下拉選單選擇書況

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOtherInputChange = (event) => {
    setOtherText(event.target.value);
  };

  //圖片處理
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview('');
    }
  }, [image]);

  useEffect(() => {
    if (addUsedBook.data?.data) {
      if (isSubmit) {
        alert(addUsedBook.data?.data);
        setIsSubmit(false);
        navigate(-1);
      }
    }
  }, [isSubmit, addUsedBook.data?.data]);
  //點擊div圖片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUploadClick = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  };

  //表單提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmit) {
      // if (!data?.data || !image) {
      //   console.error('必要的資訊不完整');
      //   return;
      // }

      if (isbn === '') {
        alert('請輸入ISBN');
        return;
      }
      if (selectedOption === '') {
        alert('請選擇書況');
        return;
      }
      if (image === null) {
        alert('請上傳書況圖片');
        return;
      }

      if (category === null) {
        alert('請選擇書籍類別');
        return;
      }

      const uploadData: PostApiUsedBooksBody = {
        BookStatus: selectedOption === '其他' ? otherText : selectedOption,
        ISBN: isbn,
        Price: Number(price),
        ImageFile: image as Blob,
        CategoryId: Number(category)
      };
      addUsedBook.mutate({ data: uploadData });
      setIsSubmit(true);
    }
  };
  function addNewLines(str, maxLineLength) {
    let result = '';
    while (str.length > maxLineLength) {
      result += str.substring(0, maxLineLength) + '\n';
      str = str.substring(maxLineLength);
    }
    result += str; // 添加剩餘的字符串（如果有）
    return result;
  }
  function getDescription(usedbook) {
    if (!usedbook.description) return '沒有書籍介紹';
    if (usedbook.description.length > 150) {
      return addNewLines(usedbook.description.substring(0, 100), 50) + '...';
    }
    return addNewLines(usedbook.description, 50);
  }
  return (
    <div>
      <div className='grid-line'>
        <span className='line-one'></span>
        <span className='line-two'></span>
        <span className='line-three'></span>
        <span className='line-four'></span>
      </div>

      <section
        className='page-title'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></section>

      <form onSubmit={handleSubmit}>
        <div className='check-availability'>
          <div className='auto-container'>
            <div className='sidebar'>
              <div
                className='search-box2 row justify-content-center '
                style={{
                  marginTop: '0px',
                  position: 'relative',
                  top: '-50px',
                  borderRadius: '10px'
                }}
              >
                <div
                  className='sidebar-widget search-box col-lg-6'
                  style={{
                    backgroundColor: '#efefef',
                    width: '400px',
                    borderRadius: '15px 0px 0px 0px'
                  }}
                >
                  <div className='form-group'>
                    <input
                      name='isbn'
                      style={{ backgroundColor: '#ffff' }}
                      placeholder='請輸入書籍ISBN碼'
                      type='text'
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      onBlur={() => refetch()}
                    />
                    <button
                      name='search'
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                </div>
                <div
                  className='col-lg-6'
                  style={{
                    backgroundImage: `url(${decorate})`,
                    height: '142px',
                    display: 'flex',
                    borderRadius: '0px 0px 15px 0px'
                  }}
                >
                  <p
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'normal',
                      margin: '25px',
                      marginLeft: '50px',
                      justifyContent: 'center'
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      style={{ color: '#ffffff' }}
                    />
                    &ensp;1.請先輸入ISBN碼，系統會自動帶出書籍資訊
                    <br />
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      style={{ color: '#ffffff' }}
                    />
                    &ensp;2.輸入二手書販售金額及書況
                    <br />
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      style={{ color: '#ffffff' }}
                    />
                    &ensp;3.上傳書況圖片
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 書籍資訊渲染及圖片上傳表單部分... */}

        <section className='section-fourty-eight'>
          <div className='auto-container'>
            <div className='row justify-content-center'>
              <div className='col-lg-6'>
                <div className='block-fourty-eight'>
                  <div className='sub-title'>Book information</div>
                  <div className='sidebar-title'>
                    <h3>書籍資訊</h3>
                  </div>
                  <h4
                    className=' mb-30px'
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      fontFamily: 'serif'
                    }}
                  >
                    {' '}
                    {data?.data?.title || '書籍名稱'}
                  </h4>
                  <br />
                  {/* <div className='text'>
                    Check out Hotels Downtown Seattle. Save Time, and Find it{' '}
                  </div> */}
                  <ul style={{ padding: '0px' }}>
                    <li>
                      <FontAwesomeIcon icon={faUser} />
                      <span>
                        &ensp;{data?.data?.authors?.join(', ') || '書籍作者'}
                      </span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faBook} />
                      <span>
                        {' '}
                        &ensp;{data?.data?.publisher || '書籍出版社'}
                      </span>
                    </li>
                  </ul>
                  <div
                    className={`text-two text-description ${
                      data?.data?.description &&
                      data.data.description.length > 200
                        ? 'text-scrollable'
                        : ''
                    }`}
                    style={{
                      whiteSpace: 'pre-wrap',
                      backgroundColor: '#f8f8f8',
                      borderRadius: '10px'
                    }}
                  >
                    {data?.data?.description || '    書籍描述'}
                  </div>
                </div>
              </div>

              {/* 書籍封面 */}
              <div
                className='col-lg-6'
                style={{
                  backgroundColor: '#FBF4EE',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '500px',
                  height: '500px',
                  borderRadius: '10px'
                }}
              >
                <img
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%'
                  }}
                  src={data?.data?.imageLinks?.thumbnail || defaultImage2}
                  alt={`${data?.data?.title}`}
                />
              </div>
            </div>
          </div>
        </section>
        <section className='section-fourty-eight'>
          <div className='auto-container'>
            <div className='row justify-content-center'>
              <div className='col-lg-6'>
                <div className='block-fourty-eight'>
                  <div className='sub-title'>Price & Statue</div>
                  <div className='sidebar-title'>
                    <h3>二手書販售訊息</h3>
                  </div>
                  {/* 金額 */}
                  <input
                    onChange={(e) => setPrice(e.target.value)}
                    type='text'
                    className='form-control'
                    name='price'
                    value={price}
                    placeholder='輸入二手書販售金額'
                    required
                  ></input>
                  {/* 書況 */}
                  <select
                    style={{ marginTop: '20px' }}
                    className='select-style form-control2'
                    name='statue'
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option value=''>請選擇書況</option>
                    <option value='全新'>全新</option>
                    <option value='九成新'>九成新</option>
                    <option value='有污漬、折損'>有污漬、折損</option>
                    <option value='有做筆記'>有做筆記</option>
                    <option value='有作家簽名'>有作家簽名</option>
                    <option value='其他'>其他</option>
                  </select>
                  {selectedOption === '其他' && (
                    <input
                      className='form-control'
                      name='otherText'
                      type='text'
                      value={otherText}
                      onChange={handleOtherInputChange}
                      placeholder='請說明其他書況'
                    />
                  )}
                  <select
                    style={{ marginTop: '20px' }}
                    className='select-style form-control2'
                    name='category'
                    value={category}
                    onChange={handleSelectCategoryChange}
                  >
                    <option value=''>請選擇書籍類別</option>
                    <option value='1'>文學小說</option>
                    <option value='3'>商業理財</option>
                    <option value='4'>藝術設計</option>
                    <option value='5'>人文社科</option>
                    <option value='6'>心理勵志</option>
                    <option value='7'>飲食文學</option>
                    <option value='9'>懸疑推理</option>
                  </select>
                  <div className='block-42c'>
                    <div
                      className='icon-two'
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        style={{
                          color: '#ffffff',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      />
                    </div>
                    <div className='cta-box'>
                      <h6>
                        請確實選擇書況，與上傳書況圖片
                        <br />
                        以免發生後續爭議，販售金額需為正整數!
                      </h6>
                      {/* <div className='cta-text'>販售金額需為正整數</div> */}
                    </div>
                  </div>
                  <button
                    style={{ marginTop: '20px' }}
                    type='submit'
                    className='btn-style-one'
                  >
                    <FontAwesomeIcon icon={faCheck} /> 確認送出
                  </button>
                  &emsp;&emsp;
                  <Link
                    to='/usedBook/used-book-list'
                    style={{ marginTop: '20px' }}
                    className='btn-style-one'
                  >
                    <span>
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{ color: '#ffffff' }}
                      />
                      &nbsp;取消上架
                    </span>
                  </Link>
                </div>
              </div>
              <div
                className=' col-lg-6'
                style={{
                  backgroundColor: '#efefef',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '500px',
                  height: '500px',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <div className='upload-area ' onClick={handleImageUploadClick}>
                  {preview ? (
                    <img
                      src={preview}
                      alt='預覽圖片'
                      className='image-preview'
                    />
                  ) : (
                    <div className=''>
                      <FontAwesomeIcon
                        icon={faImage}
                        style={{
                          color: '#7d7d7d',
                          fontSize: '50px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingLeft: '60px'
                        }}
                      />
                      <br />
                      點擊此處上傳書況圖片
                    </div>
                  )}
                  <input
                    id='fileInput'
                    type='file'
                    name='imageFile'
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default AddUsedBook;
