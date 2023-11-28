import {Modal, Button, Form} from 'antd';
import React, {useState, useEffect, useRef } from "react";
import {getUnits, getUnit, createUnit, getAllUnits, getLessonModuleAll, updateLessonModule, getLessonModule, updateUnit} from '../../../../../Utils/requests';
import { Divider, message } from 'antd';
import '../Home.less';
import './ManageCurriculumModal.less';
import '../../../../../assets/style.less';

export default function ManageCurriculumModal({gradeId, classroomId}) {
    const [visible, setVisible] = useState(false);
    const [activePanel, setActivePanel] = useState('panel-1');
    const [classroomUnits, setClassroomUnits] = useState([]);
    const [visibleStandardsByUnit, setVisibleStandardsByUnit] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [selectedUnit, setUnitID] = useState({});
    const [allUnitsList, setAllUnitsList] = useState([]);
    const [selectedLesson, setLesson] = useState({});
    const [lessonList, setLessonList] = useState([]);
    const [targetUnit, setTargetUnit] = useState("");

    const lessonDropdownRef = useRef(null);
    const unitDropdownRef = useRef(null);

    async function fetchData() {
        const [classUnitsRes, allUnitsRes, lessonsRes] = await Promise.all([
          getUnits(gradeId),
          getAllUnits(),
          getLessonModuleAll(),
        ]);

        if (classUnitsRes.data) {
          const u = classUnitsRes.data;
          setVisibleStandardsByUnit(u);
        } else {
          message.error(classUnitsRes.err);
        }
  
        if (allUnitsRes.data) {
            const allUnits = allUnitsRes.data;
            const classUnits = allUnits
                .filter((unitData) => unitData.classrooms.some((classroom) => classroom.id === classroomId))
            console.log(classUnits);
            setAllUnitsList(allUnits);
            setClassroomUnits(classUnits);
        } else {
          message.error(allUnitsRes.err);
        }
  
        if (lessonsRes.data) {
          setLessonList(lessonsRes.data);
        } else {
          message.error(lessonsRes.err);
        }
      }

    useEffect(() => {
        if (gradeId || refreshData) {
            fetchData();
            setRefreshData(false);
        }
    }, [setVisibleStandardsByUnit, gradeId, refreshData]);

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setTargetUnit();
        setUnitID("");
        if (unitDropdownRef.current) {
            unitDropdownRef.current.value = selectedUnit; // Replace '' with the appropriate default value
        }
        setLesson({});
        if (lessonDropdownRef.current) {
            lessonDropdownRef.current.value = selectedLesson; // Replace '' with the appropriate default value
        }
        setVisible(false);
    };

    const handleOk = () => {
        setTargetUnit();
        setUnitID("");
        if (unitDropdownRef.current) {
            unitDropdownRef.current.value = selectedUnit; // Replace '' with the appropriate default value
        }
        setLesson({});
        if (lessonDropdownRef.current) {
            lessonDropdownRef.current.value = selectedLesson; // Replace '' with the appropriate default value
        }
        setVisible(false);
    };

    async function handleRemoveLesson(lessonId){
        let curLesson = await getLessonModule(lessonId);

        let lessonName = curLesson.data.name;

        const res = await updateLessonModule(lessonId,
            curLesson.data.name,
            curLesson.data.expectations,
            curLesson.data.standards,
            curLesson.data.link,
            null
        );
        
        setRefreshData(true);

        if (res.err) {
            message.error("Failed to remove the lesson \"" + lessonName + "\"");
        } else {
            message.success("Successfully removed the lesson \"" + lessonName + "\"");
        }
    }

    async function handleRemoveUnit(unitId){
        let curUnit;
        let u = await getUnit(unitId);
        
        if(u.data){
            curUnit = u.data;
        }

        let unitName = curUnit.name;

        let updatedClassroomArray = [];

        curUnit.classrooms.forEach((classroom) => {
            if(classroom.id != classroomId){
                updatedClassroomArray.push(String(classroom.id));
            }
        });

        const res = await updateUnit(
            unitId,
            String(curUnit.number),
            curUnit.name,
            curUnit.standards_id,
            curUnit.standards_description,
            String(curUnit.grade.id),
            updatedClassroomArray
        );

        setRefreshData(true);
        if(targetUnit == unitId){
            setTargetUnit("")
        }
            
        if (res.err) {
            message.error("Failed to remove " + unitName + " from this classroom");
        } else {
            message.success("Successfully removed " + unitName + " from this classroom");
        }
    }

    /*
    Adds the unit that is currently selected (one will 
    definitely be selected due to prior logic), to the current classroom
    */
    async function handleAddUnit(){
        let curUnit;
        let u = await getUnit(selectedUnit);
        
        if(u.data){
            curUnit = u.data;
        }

        let unitName = curUnit.name;

        let updatedClassroomArray = [];

        curUnit.classrooms.forEach((classroom) => {
            updatedClassroomArray.push(String(classroom.id));
        });

        if (!updatedClassroomArray.includes(classroomId)) {
            updatedClassroomArray.push(String(classroomId));

            const res = await updateUnit(
                selectedUnit,
                String(curUnit.number),
                curUnit.name,
                curUnit.standards_id,
                curUnit.standards_description,
                String(curUnit.grade.id),
                updatedClassroomArray
            );

            setRefreshData(true);

            if (res.err) {
                message.error("Failed to add " + unitName + " to this classroom");
            } else {
                message.success("Successfully added " + unitName + " to this classroom");
            }
        } else {
            message.error("Failed to add " + unitName + " to this classroom");
        }
    };

    async function handleAddLesson(){
        let curLesson = await getLessonModule(selectedLesson);

        let lessonName = curLesson.data.name;

        const res = await updateLessonModule(
            selectedLesson,
            curLesson.data.name,
            curLesson.data.expectations,
            curLesson.data.standards,
            curLesson.data.link,
            targetUnit
        );
        
        setLesson({});
        if (lessonDropdownRef.current) {
            lessonDropdownRef.current.value = selectedLesson; // Replace '' with the appropriate default value
        }
        setRefreshData(true);

        if (res.err) {
            message.error("Failed to add the lesson \"" + lessonName + "\"");
        } else {
            message.success("Successfully added the lesson \"" + lessonName + "\"");
        }
    };

    return (
        <div id='manage-curriculum-modal'>
            <button id='change-lesson-btn' onClick={showModal}>
                <p id='test'>Manage Curriculum</p>
            </button>
            
            <Modal
                title={'Manage Curriculum'}
                visible={visible}
                onOk={handleOk}
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
                                return classroomUnits.find((classUnit) => classUnit.id === unit.id) ? (
                                <div key={unit.id} 
                                    onClick={() => setTargetUnit(unit.id)}
                                    className = "list-item-container"
                                    id ={
                                        targetUnit == unit.id
                                            ? 'selected-unit'
                                            : ''
                                    }
                                >
                                    <Divider orientation='center'>
                                        <div className="unit-info">
                                            <span>{`Unit ${unit.number} - ${unit.name}`}</span>
                                            <div className="unit-delete-button" onClick={() => handleRemoveUnit(unit.id)}>
                                            &#x2716;
                                            </div>
                                        </div>
                                    </Divider>
                                    {unit.lesson_modules.map((ls) => (
                                    <div className = "lesson-row">
                                        <div
                                            key={ls.id}
                                            id={'list-item-wrapper'}
                                            
                                        >
                                            <div className="list-text">
                                                <li>{ls.name}</li>
                                            </div>
                                        </div>
                                        <div className="lesson-delete-button" onClick={() => handleRemoveLesson(ls.id)}>
                                            &#x2716;
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
                                ref={unitDropdownRef}
                                id="unit-dropdown"
                                className="edit-curriculum-dropdown"
                                name="unit"
                                defaultValue={selectedUnit}
                                required
                                onChange={e => setUnitID(e.target.value)}
                                >
                                    <option key={0} value={selectedUnit} disabled id="disabled-option">
                                        Available Units
                                    </option>
                                    {allUnitsList
                                    .filter((unitData) => unitData.grade.id === gradeId)
                                    .filter((unitData) => !unitData.classrooms.some((classroom) => classroom.id === classroomId))
                                    .map((unit_) => (
                                        <option key={unit_.id} value={unit_.id}>
                                        {unit_.name}
                                        </option>
                                    ))}
                                </select>
                            </Form.Item>
                            <Button
                            type="primary"
                            onClick={handleAddUnit}
                            disabled={Object.keys(selectedUnit).length === 0}
                            style={{display: 'block', margin: 'auto'}}
                            >
                                Add Unit
                            </Button>
                            <Divider orientation='center'>{`Add Lesson to Selected Unit`}</Divider>
                            <Form.Item id="form-label" label="Lesson">
                                <select
                                ref={lessonDropdownRef}
                                id="lesson-dropdown"
                                className="edit-curriculum-dropdown"
                                name="lesson"
                                defaultValue={selectedLesson}
                                required
                                onChange={e => setLesson(e.target.value)}
                                >
                                    <option key={0} value={selectedLesson} disabled id="disabled-option">
                                        Available Lessons
                                    </option>
                                    {lessonList
                                    .filter((lesson_) => lesson_.unit == null)
                                    .map((lesson_) => (
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
                                    disabled={Object.keys(selectedLesson).length === 0 || // Condition 1: Check if selectedLesson is empty
                                    !classroomUnits.some(unit => unit.id == targetUnit)}
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
