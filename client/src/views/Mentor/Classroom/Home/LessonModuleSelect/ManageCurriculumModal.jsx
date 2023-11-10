import {Modal, Button, Form} from 'antd';
import React, {useState, useEffect} from "react";
import {getUnits, getAllUnits, getLessonModuleAll, getLessonModule} from '../../../../../Utils/requests';
import { Divider, message } from 'antd';
import '../Home.less';
import './ManageCurriculumModal.less';
import '../../../../../assets/style.less';

export default function ManageCurriculumModal({gradeId}) {
    const [visible, setVisible] = useState(false);
    const [activePanel, setActivePanel] = useState('panel-1');
    const [selected, setSelected] = useState({});
    const [checkedList, setCheckedList] = useState([]);
    const [visibleStandardsByUnit, setVisibleStandardsByUnit] = useState([]);

    const [unit, setUnitID] = useState({});
    const [allUnitsList, setAllUnitsList] = useState([]);

    const [lesson, setLesson] = useState({});
    const [lessonList, setLessonList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const [classUnitsRes, allUnitsRes, lessonsRes] = await Promise.all([
                getUnits(gradeId),
                getAllUnits(),
                getLessonModuleAll(),
            ]);
            if (classUnitsRes.data) {
                const u = classUnitsRes.data;
                setVisibleStandardsByUnit(u);
                const options = u.map((unitData) => {
                return {
                    id: unitData.id,
                    number: unitData.number,
                    name: unitData.name,
                };
                });
                setCheckedList(options);
            } else {
                message.error(classUnitsRes.err);
            }

            if (allUnitsRes.data) {
                const allUnits = allUnitsRes.data;
                setAllUnitsList(allUnits);
            }else{
                message.error(allUnitsRes.err);
            }

            if(lessonsRes.data){
                const allLessons = (lessonsRes.data);
                setLessonList(lessonsRes.data);
            }else{
                message.error(lessonsRes.err);
            }
        }
        if (gradeId) fetchData();
    }, [setVisibleStandardsByUnit, gradeId]);

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const handleOk = () => {
        setVisible(false)
    };

    const handleDeleteLesson = (lessonId) => {

    }

    const handleAddUnit = () => {

    };

    const handleAddLesson = () => {

    };

    return (
        <div id='manage-curriculum-modal'>
            <button id='change-lesson-btn' onClick={showModal}>
                <p id='test'>Manage Curriculum</p>
            </button>
            
            <Modal
                title={
                activePanel === 'panel-1'
                    ? 'Manage Curriculum'
                    : selected.name
                }
                visible={visible}
                onCancel={handleCancel}
                width='60vw'
            >

            <div className = 'overflow-hidden'>
                <div className = 'modal-content-container'>
                    <div className = 'column' id = 'column1'>
                        <div
                            id='panel-1'
                            className={activePanel === 'panel-1' ? 'panel-1 show' : 'panel-1 hide'}
                        >
                            <Divider orientation='center'>{`Classroom Contents`}</Divider>
                            <div id='list-container'>
                            {visibleStandardsByUnit.map((unit) => {
                                return checkedList.find((checked) => checked.id === unit.id) ? (
                                <div key={unit.id} className = "list-item-container">
                                    <Divider orientation='left'>{`Unit ${unit.number}- ${unit.name}`}</Divider>
                                    {unit.lesson_modules.map((ls) => (
                                    <div className = "lesson-row">
                                        <div
                                            key={ls.id}
                                            id={
                                            selected.id !== ls.id
                                                ? 'list-item-wrapper'
                                                : 'selected-lesson-module'
                                            }
                                            onClick={() => getSelectedLessonModule(ls)}
                                        >
                                            <div className="list-text">
                                                <li>{ls.name}</li>
                                            </div>
                                        </div>
                                        <div className="delete-button" onClick={() => handleDeleteLesson(ls.id)}>
                                            X
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                ) : null;
                            })}
                            </div>
                        </div>
                    </div>
                    <div className = 'column' id = 'column2'>
                        <Form
                            id="select-unit"
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            layout="horizontal"
                            size="default"
                            >
                            <Divider orientation='center'>{`Add Unit to Classroom`}</Divider>
                            <Form.Item id="form-label" label="Unit">
                                <select
                                id="unit-dropdown"
                                className="edit-curriculum-dropdown"
                                name="unit"
                                defaultValue={unit}
                                required
                                onChange={e => setUnitID(e.target.value)}
                                >
                                    <option key={0} value={unit} disabled id="disabled-option">
                                        Available Units
                                    </option>
                                    {allUnitsList.map((unit_) => (
                                        <option key={unit_.id} value={unit_.id}>
                                        {unit_.name}
                                        </option>
                                    ))}
                                </select>
                            </Form.Item>
                            <Button
                            type="primary"
                            onClick={handleAddUnit}
                            disabled={Object.keys(unit).length === 0}
                            style={{display: 'block', margin: 'auto'}}
                            >
                                Add Unit
                            </Button>
                            <Divider orientation='center'>{`Add Lesson to Unit`}</Divider>
                            <Form.Item id="form-label" label="Lesson">
                                <select
                                id="lesson-dropdown"
                                className="edit-curriculum-dropdown"
                                name="lesson"
                                defaultValue={lesson}
                                required
                                onChange={e => setLesson(e.target.value)}
                                >
                                    <option key={0} value={lesson} disabled id="disabled-option">
                                        Available Lessons
                                    </option>
                                    {lessonList.map((lesson_) => (
                                        <option key={lesson_.id} value={lesson_.id}>
                                            {lesson_.name}
                                        </option>
                                    ))}
                                </select>
                            </Form.Item>
                            <div className='button-container'>
                            <Button
                                type="primary"
                                onClick={handleAddLesson} 
                                disabled={Object.keys(lesson).length === 0}
                                style={{display: 'block', margin: 'auto'}}
                                >
                                    Add Lesson
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
            </Modal>
        </div>
    );
}
